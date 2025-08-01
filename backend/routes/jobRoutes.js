const express = require('express');
const { authMiddleware, adminMiddleware } = require('../src/middleware/auth');
const { scrapeJobPostings } = require('../services/scraperService');

const router = express.Router();

/**
 * Route to initiate job scraping
 * Protected with authentication middleware
 */
router.get('/scrape-jobs', authMiddleware, async (req, res) => {
  try {
    const url = 'https://example.com/jobs'; // Replace this with actual job URL
    const jobs = await scrapeJobPostings(url);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error during job scraping:', error);
    res.status(500).json({ error: 'Failed to scrape jobs' });
  }
});

/**
 * Test admin route
 * Protected with admin middleware
 */
router.get('/admin', adminMiddleware, (req, res) => {
  res.status(200).send('Welcome, admin!');
});

module.exports = router;
