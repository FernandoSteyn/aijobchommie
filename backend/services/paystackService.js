const axios = require('axios');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = 'https://api.paystack.co';
    this.headers = {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    const hash = crypto.createHmac('sha512', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  }

  // Initialize transaction with multiple payment channels
  async initializeTransaction(email, amount, metadata = {}, channels = []) {
    try {
      const paymentData = {
        email,
        amount: amount * 100, // Convert to kobo (cents)
        currency: 'ZAR',
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'Invoice ID',
              variable_name: 'invoice_id',
              value: metadata.invoiceId || `INV-${Date.now()}`
            }
          ]
        },
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`
      };

      // Add payment channels if specified
      if (channels && channels.length > 0) {
        paymentData.channels = channels;
      }

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        paymentData,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error initializing transaction:', error.response?.data || error.message);
      throw error;
    }
  }

  // Initialize USSD payment
  async initializeUSSDPayment(email, amount, metadata = {}) {
    return this.initializeTransaction(email, amount, metadata, ['ussd']);
  }

  // Initialize Mobile Money payment
  async initializeMobileMoneyPayment(email, amount, phone, metadata = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100,
          currency: 'ZAR',
          phone,
          channels: ['mobile_money'],
          metadata: {
            ...metadata,
            payment_method: 'mobile_money',
            phone_number: phone,
            custom_fields: [
              {
                display_name: 'Invoice ID',
                variable_name: 'invoice_id',
                value: metadata.invoiceId || `INV-${Date.now()}`
              }
            ]
          },
          callback_url: `${process.env.FRONTEND_URL}/payment/callback`
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error initializing mobile money payment:', error.response?.data || error.message);
      throw error;
    }
  }

  // Initialize Bank Transfer payment
  async initializeBankTransferPayment(email, amount, metadata = {}) {
    return this.initializeTransaction(email, amount, metadata, ['bank_transfer']);
  }

  // Initialize QR Code payment
  async initializeQRPayment(email, amount, metadata = {}) {
    return this.initializeTransaction(email, amount, metadata, ['qr']);
  }

  // Verify transaction
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error verifying transaction:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create subscription plan
  async createPlan(name, amount, interval = 'monthly') {
    try {
      const response = await axios.post(
        `${this.baseUrl}/plan`,
        {
          name,
          amount: amount * 100, // Convert to kobo
          interval,
          currency: 'ZAR'
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating plan:', error.response?.data || error.message);
      throw error;
    }
  }

  // Subscribe customer to plan
  async createSubscription(customer, plan) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/subscription`,
        {
          customer,
          plan
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error.response?.data || error.message);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(code, token) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/subscription/disable`,
        {
          code,
          token
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create customer
  async createCustomer(email, firstName, lastName, phone) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/customer`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error.response?.data || error.message);
      throw error;
    }
  }

  // Process webhook events
  async handleWebhook(event, data) {
    try {
      switch (event) {
        case 'charge.success':
          await this.handleSuccessfulPayment(data);
          break;
        case 'subscription.create':
          await this.handleSubscriptionCreated(data);
          break;
        case 'subscription.disable':
          await this.handleSubscriptionCanceled(data);
          break;
        default:
          console.log('Unhandled webhook event:', event);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Handle successful payment
  async handleSuccessfulPayment(data) {
    const { customer, amount, reference, metadata } = data;
    
    // Update user subscription status in database
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_email: customer.email,
        amount: amount / 100, // Convert back from kobo
        reference,
        status: 'active',
        metadata,
        paid_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    // Update user profile to premium
    await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'premium',
        subscription_updated_at: new Date().toISOString()
      })
      .eq('email', customer.email);
  }

  // Handle subscription created
  async handleSubscriptionCreated(data) {
    const { customer, plan, subscription_code, status } = data;
    
    await supabase
      .from('subscriptions')
      .upsert({
        user_email: customer.email,
        plan_name: plan.name,
        plan_code: plan.plan_code,
        subscription_code,
        status,
        created_at: new Date().toISOString()
      });
  }

  // Handle subscription canceled
  async handleSubscriptionCanceled(data) {
    const { customer } = data;
    
    await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'free',
        subscription_updated_at: new Date().toISOString()
      })
      .eq('email', customer.email);
  }
}

module.exports = new PaystackService();
