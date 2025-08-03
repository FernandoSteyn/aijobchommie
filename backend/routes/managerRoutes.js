const express = require('express');
const { authMiddleware, adminMiddleware } = require('../src/middleware/auth');
const { supabase } = require('../config/supabase');
const costTrackingService = require('../services/costTrackingService');

const router = express.Router();

// Get financial overview
router.get('/financial', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Get total revenue
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('amount, status')
      .eq('status', 'active');

    if (subError) throw subError;

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const monthlyRevenue = totalRevenue; // Since all plans are monthly
    const activeSubscriptions = subscriptions.length;

    res.json({
      totalRevenue,
      monthlyRevenue,
      activeSubscriptions,
      basicSubscriptions: subscriptions.filter(s => s.amount === 8).length,
      premiumSubscriptions: subscriptions.filter(s => s.amount === 17).length
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// Get usage metrics
router.get('/metrics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const oneDayAgo = new Date(now.setDate(now.getDate() - 1));

    // Get monthly active users
    const { data: monthlyUsers, error: monthlyError } = await supabase
      .from('profiles')
      .select('id')
      .gte('last_login', thirtyDaysAgo.toISOString());

    if (monthlyError) throw monthlyError;

    // Get daily active users
    const { data: dailyUsers, error: dailyError } = await supabase
      .from('profiles')
      .select('id')
      .gte('last_login', oneDayAgo.toISOString());

    if (dailyError) throw dailyError;

    // Get new signups this month
    const { data: newSignups, error: signupError } = await supabase
      .from('profiles')
      .select('id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (signupError) throw signupError;

    res.json({
      monthlyActiveUsers: monthlyUsers.length,
      dailyActiveUsers: dailyUsers.length,
      newSignups: newSignups.length,
      conversionRate: ((subscriptions.length / monthlyUsers.length) * 100).toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get potential problems/issues
router.get('/problems', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const problems = [];

    // Check for recent errors
    const { data: errors, error: errorError } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (errorError) throw errorError;

    if (errors && errors.length > 5) {
      problems.push({
        severity: 'high',
        description: `${errors.length} errors logged in the last 24 hours`,
        type: 'errors'
      });
    }

    // Check for failed payments
    const { data: failedPayments, error: paymentError } = await supabase
      .from('payment_logs')
      .select('*')
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (paymentError) throw paymentError;

    if (failedPayments && failedPayments.length > 0) {
      problems.push({
        severity: 'medium',
        description: `${failedPayments.length} failed payment attempts in the last 24 hours`,
        type: 'payments'
      });
    }

    // Check server health (placeholder - implement actual health checks)
    // problems.push({
    //   severity: 'low',
    //   description: 'Server response time increased by 20%',
    //   type: 'performance'
    // });

    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get cost tracking dashboard data
router.get('/cost-dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dashboardData = await costTrackingService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching cost dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch cost dashboard data' });
  }
});

// Get monthly cost breakdown
router.get('/costs/monthly', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const monthlyCosts = await costTrackingService.getMonthlyCosts();
    res.json(monthlyCosts);
  } catch (error) {
    console.error('Error fetching monthly costs:', error);
    res.status(500).json({ error: 'Failed to fetch monthly costs' });
  }
});

// Log a manual cost entry
router.post('/costs/log', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { serviceName, costType, amount, description } = req.body;
    await costTrackingService.logCost(serviceName, costType, amount, description);
    res.json({ success: true, message: 'Cost logged successfully' });
  } catch (error) {
    console.error('Error logging cost:', error);
    res.status(500).json({ error: 'Failed to log cost' });
  }
});

// Get optimization suggestions
router.get('/costs/suggestions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const suggestions = await costTrackingService.generateOptimizationSuggestions();
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching optimization suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch optimization suggestions' });
  }
});

// Initialize cost tracking (run once)
router.post('/costs/initialize', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await costTrackingService.initializeCostTables();
    res.json({ success: true, message: 'Cost tracking initialized' });
  } catch (error) {
    console.error('Error initializing cost tracking:', error);
    res.status(500).json({ error: 'Failed to initialize cost tracking' });
  }
});

module.exports = router;
