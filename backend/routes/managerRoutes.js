const express = require('express');
const { authMiddleware, adminMiddleware } = require('../src/middleware/auth');
const { supabase } = require('../config/supabase');

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

module.exports = router;
