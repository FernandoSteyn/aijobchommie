const jwt = require('jsonwebtoken');
const { supabase } = require('../../config/supabase');

/**
 * Middleware to verify JWT tokens for protected routes
 */
async function authMiddleware(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Middleware to check if user is an admin
 */
async function adminMiddleware(req, res, next) {
  try {
    const adminEmails = ['fsteyn@rocketmail.com', 'admin@aijobchommie.co.za'];
    
    if (!req.user || !adminEmails.includes(req.user.email)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Authorization failed' });
  }
}

module.exports = { authMiddleware, adminMiddleware };
