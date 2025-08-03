const { supabase } = require('../config/supabase');
const axios = require('axios');
const cron = require('node-cron');

class CostTrackingService {
  constructor() {
    this.monthlyBudget = 150; // R150 maximum budget
    this.costBreakdown = {
      hosting: 0,
      aiApiCalls: 0,
      database: 0,
      paymentProcessing: 0,
      other: 0
    };
    this.alerts = [];
  }

  // Initialize cost tracking tables in Supabase
  async initializeCostTables() {
    try {
      // Create cost_tracking table
      const costTableQuery = `
        CREATE TABLE IF NOT EXISTS cost_tracking (
          id SERIAL PRIMARY KEY,
          service_name VARCHAR(100) NOT NULL,
          cost_type VARCHAR(50) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'ZAR',
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Create budget_alerts table
      const alertsTableQuery = `
        CREATE TABLE IF NOT EXISTS budget_alerts (
          id SERIAL PRIMARY KEY,
          alert_type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          threshold_percentage INTEGER,
          current_amount DECIMAL(10,2),
          budget_amount DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT NOW(),
          resolved BOOLEAN DEFAULT FALSE
        );
      `;

      // Create service_metrics table
      const metricsTableQuery = `
        CREATE TABLE IF NOT EXISTS service_metrics (
          id SERIAL PRIMARY KEY,
          service_name VARCHAR(100) NOT NULL,
          metric_name VARCHAR(100) NOT NULL,
          metric_value TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT NOW()
        );
      `;

      await supabase.rpc('execute_sql', { query: costTableQuery });
      await supabase.rpc('execute_sql', { query: alertsTableQuery });
      await supabase.rpc('execute_sql', { query: metricsTableQuery });

      console.log('✅ Cost tracking tables initialized');
    } catch (error) {
      console.error('Error initializing cost tables:', error);
    }
  }

  // Log a cost entry
  async logCost(serviceName, costType, amount, description = '') {
    try {
      const { error } = await supabase
        .from('cost_tracking')
        .insert({
          service_name: serviceName,
          cost_type: costType,
          amount: amount,
          description: description
        });

      if (error) throw error;
      
      // Check if we're approaching budget limits
      await this.checkBudgetThresholds();
      
      console.log(`💰 Logged cost: ${serviceName} - R${amount}`);
    } catch (error) {
      console.error('Error logging cost:', error);
    }
  }

  // Get monthly costs breakdown
  async getMonthlyCosts() {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('cost_tracking')
        .select('service_name, cost_type, amount')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (error) throw error;

      // Calculate totals by service
      const breakdown = {};
      let totalCost = 0;

      data.forEach(entry => {
        if (!breakdown[entry.service_name]) {
          breakdown[entry.service_name] = 0;
        }
        breakdown[entry.service_name] += parseFloat(entry.amount);
        totalCost += parseFloat(entry.amount);
      });

      return {
        breakdown,
        totalCost,
        budgetRemaining: this.monthlyBudget - totalCost,
        budgetUsedPercentage: (totalCost / this.monthlyBudget) * 100
      };
    } catch (error) {
      console.error('Error getting monthly costs:', error);
      return { breakdown: {}, totalCost: 0, budgetRemaining: this.monthlyBudget };
    }
  }

  // Check budget thresholds and create alerts
  async checkBudgetThresholds() {
    try {
      const costs = await this.getMonthlyCosts();
      const usedPercentage = costs.budgetUsedPercentage;

      // Alert thresholds
      const thresholds = [
        { percentage: 50, type: 'warning', message: 'Budget 50% used' },
        { percentage: 75, type: 'caution', message: 'Budget 75% used - Consider optimization' },
        { percentage: 90, type: 'critical', message: 'Budget 90% used - Immediate action required' },
        { percentage: 100, type: 'exceeded', message: 'Budget exceeded!' }
      ];

      for (const threshold of thresholds) {
        if (usedPercentage >= threshold.percentage) {
          await this.createAlert(
            threshold.type,
            threshold.message,
            threshold.percentage,
            costs.totalCost,
            this.monthlyBudget
          );
        }
      }
    } catch (error) {
      console.error('Error checking budget thresholds:', error);
    }
  }

  // Create budget alert
  async createAlert(alertType, message, thresholdPercentage, currentAmount, budgetAmount) {
    try {
      // Check if similar alert already exists today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingAlerts } = await supabase
        .from('budget_alerts')
        .select('id')
        .eq('alert_type', alertType)
        .gte('created_at', today);

      if (existingAlerts && existingAlerts.length > 0) {
        return; // Don't create duplicate alerts
      }

      const { error } = await supabase
        .from('budget_alerts')
        .insert({
          alert_type: alertType,
          message: message,
          threshold_percentage: thresholdPercentage,
          current_amount: currentAmount,
          budget_amount: budgetAmount
        });

      if (error) throw error;

      // Send notification (you can implement email/SMS here)
      console.log(`🚨 BUDGET ALERT: ${message}`);
      
      // If critical, you might want to disable expensive features temporarily
      if (alertType === 'critical' || alertType === 'exceeded') {
        await this.enableCostSavingMode();
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  // Enable cost-saving mode
  async enableCostSavingMode() {
    try {
      // Reduce AI API calls frequency
      // Disable non-essential features
      // Cache more aggressively
      
      const { error } = await supabase
        .from('service_metrics')
        .insert({
          service_name: 'cost_management',
          metric_name: 'cost_saving_mode',
          metric_value: 'enabled'
        });

      console.log('🛡️ Cost-saving mode enabled');
    } catch (error) {
      console.error('Error enabling cost-saving mode:', error);
    }
  }

  // Track API usage costs
  async trackHuggingFaceUsage() {
    try {
      // Estimate costs based on API calls
      const { data: aiCache } = await supabase
        .from('ai_cache')
        .select('operation')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (aiCache) {
        const estimatedCost = aiCache.length * 0.002; // Estimated R0.002 per API call
        await this.logCost('hugging_face', 'api_calls', estimatedCost, `${aiCache.length} API calls`);
      }
    } catch (error) {
      console.error('Error tracking Hugging Face usage:', error);
    }
  }

  // Track Supabase costs
  async trackSupabaseCosts() {
    try {
      // Estimate based on database operations
      // This is a simplified estimation - actual costs depend on Supabase pricing
      const dailyOperations = 1000; // Estimate
      const estimatedCost = dailyOperations * 0.0001; // Very rough estimate
      
      await this.logCost('supabase', 'database_operations', estimatedCost, 'Daily database operations');
    } catch (error) {
      console.error('Error tracking Supabase costs:', error);
    }
  }

  // Auto-optimization suggestions
  async generateOptimizationSuggestions() {
    try {
      const costs = await this.getMonthlyCosts();
      const suggestions = [];

      // AI API optimization
      const { data: cacheStats } = await supabase
        .from('ai_cache')
        .select('operation')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const cacheHitRatio = this.calculateCacheHitRatio();
      if (cacheHitRatio < 60) {
        suggestions.push({
          category: 'ai_optimization',
          suggestion: 'Improve AI cache hit ratio - currently at ' + cacheHitRatio + '%',
          potential_savings: 'R20-50/month'
        });
      }

      // Database optimization
      if (costs.breakdown.supabase > 20) {
        suggestions.push({
          category: 'database_optimization',
          suggestion: 'Consider optimizing database queries and implementing better caching',
          potential_savings: 'R10-30/month'
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      return [];
    }
  }

  // Calculate cache hit ratio (placeholder)
  calculateCacheHitRatio() {
    // This would calculate actual cache hit ratio from your AI cache service
    return 75; // Placeholder
  }

  // Schedule automated cost tracking
  scheduleAutomatedTracking() {
    // Daily cost tracking at 23:00
    cron.schedule('0 23 * * *', async () => {
      console.log('🔄 Running daily cost tracking...');
      await this.trackHuggingFaceUsage();
      await this.trackSupabaseCosts();
      await this.checkBudgetThresholds();
    });

    // Weekly optimization report
    cron.schedule('0 9 * * 1', async () => {
      console.log('📊 Generating weekly optimization report...');
      const suggestions = await this.generateOptimizationSuggestions();
      console.log('Optimization suggestions:', suggestions);
    });

    // Monthly cost report
    cron.schedule('0 9 1 * *', async () => {
      console.log('📈 Generating monthly cost report...');
      const costs = await this.getMonthlyCosts();
      console.log('Monthly costs:', costs);
    });

    console.log('⏰ Automated cost tracking scheduled');
  }

  // Get dashboard data for manager
  async getDashboardData() {
    try {
      const costs = await this.getMonthlyCosts();
      const { data: recentAlerts } = await supabase
        .from('budget_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(5);

      const suggestions = await this.generateOptimizationSuggestions();

      return {
        costs,
        alerts: recentAlerts || [],
        suggestions,
        status: costs.budgetUsedPercentage > 90 ? 'critical' : 
                costs.budgetUsedPercentage > 75 ? 'warning' : 'healthy'
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }
}

module.exports = new CostTrackingService();
