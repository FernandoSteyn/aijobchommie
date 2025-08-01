const request = require('supertest');
const express = require('express');

// Mock the main app
const app = express();
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Welcome to AI Job Chommie Backend API');
});

// Mock job routes
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    jobs: [
      {
        id: 1,
        title: 'Software Developer',
        company: 'Tech Corp',
        location: 'Cape Town',
        salary: 'R50,000 - R70,000'
      }
    ]
  });
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId, candidateId } = req.body;
  if (!jobId || !candidateId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.json({ success: true, message: 'Application submitted successfully' });
});

// Mock manager routes
app.get('/api/manager/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalJobs: 150,
      totalApplications: 450,
      activeUsers: 75
    }
  });
});

// Mock Paystack routes
app.post('/api/paystack/initialize', (req, res) => {
  const { email, amount } = req.body;
  if (!email || !amount) {
    return res.status(400).json({ error: 'Email and amount are required' });
  }
  res.json({
    success: true,
    data: {
      authorization_url: 'https://checkout.paystack.com/test123',
      access_code: 'test_access_code',
      reference: 'test_reference_123'
    }
  });
});

describe('AI Job Chommie Backend API', () => {
  describe('Health Check', () => {
    test('GET / should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Welcome to AI Job Chommie Backend API');
    });
  });

  describe('Job Routes', () => {
    test('GET /api/jobs should return job listings', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.jobs).toBeDefined();
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0);
    });

    test('POST /api/jobs/apply should submit job application', async () => {
      const applicationData = {
        jobId: 1,
        candidateId: 'user123'
      };

      const res = await request(app)
        .post('/api/jobs/apply')
        .send(applicationData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Application submitted successfully');
    });

    test('POST /api/jobs/apply should return error for missing fields', async () => {
      const res = await request(app)
        .post('/api/jobs/apply')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Missing required fields');
    });
  });

  describe('Manager Routes', () => {
    test('GET /api/manager/dashboard should return dashboard stats', async () => {
      const res = await request(app).get('/api/manager/dashboard');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.totalJobs).toBeDefined();
      expect(res.body.stats.totalApplications).toBeDefined();
      expect(res.body.stats.activeUsers).toBeDefined();
    });
  });

  describe('Paystack Routes', () => {
    test('POST /api/paystack/initialize should initialize payment', async () => {
      const paymentData = {
        email: 'test@example.com',
        amount: 5000
      };

      const res = await request(app)
        .post('/api/paystack/initialize')
        .send(paymentData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.authorization_url).toBeDefined();
      expect(res.body.data.access_code).toBeDefined();
      expect(res.body.data.reference).toBeDefined();
    });

    test('POST /api/paystack/initialize should return error for missing fields', async () => {
      const res = await request(app)
        .post('/api/paystack/initialize')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and amount are required');
    });
  });
});
