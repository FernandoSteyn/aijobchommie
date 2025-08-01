const express = require('express');
const { authMiddleware } = require('../src/middleware/auth');
const PaystackService = require('../services/paystackService');

const router = express.Router();

// Initialize Paystack transaction
router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const { email, amount, invoiceId } = req.body;
    const metadata = { invoiceId };
    const transaction = await PaystackService.initializeTransaction(email, amount, metadata);
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    res.status(500).json({ error: 'Failed to initialize transaction' });
  }
});

// Verify Paystack transaction
router.get('/verify/:reference', authMiddleware, async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await PaystackService.verifyTransaction(reference);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error);
    res.status(500).json({ error: 'Failed to verify transaction' });
  }
});

// Webhook for payment events
router.post('/webhook', async (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-paystack-signature'];

  if (PaystackService.verifyWebhookSignature(payload, signature)) {
    try {
      const event = payload.event;
      await PaystackService.handleWebhook(event, payload.data);
      res.status(200).send();
    } catch (error) {
      console.error('Error handling webhook event:', error);
      res.status(500).send();
    }
  } else {
    console.warn('Invalid Paystack webhook signature');
    res.status(400).send();
  }
});

module.exports = router;
