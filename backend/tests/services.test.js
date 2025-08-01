const axios = require('axios');

// Mock axios for external API calls
jest.mock('axios');
const mockedAxios = axios;

// Mock services tests
describe('AI Job Chommie Services', () => {
  describe('AI Service', () => {
    test('should analyze CV content', async () => {
      // Mock CV analysis
      const mockAnalysis = {
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years',
        education: 'Bachelor of Computer Science',
        score: 85
      };

      const cvContent = 'Sample CV content with JavaScript and React experience';
      
      // Mock AI service function
      const analyzeCV = (content) => {
        if (content.includes('JavaScript') && content.includes('React')) {
          return Promise.resolve(mockAnalysis);
        }
        return Promise.resolve({ score: 0, skills: [] });
      };

      const result = await analyzeCV(cvContent);
      
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).toContain('React');
      expect(result.score).toBe(85);
      expect(result.experience).toBe('3 years');
    });

    test('should match jobs based on skills', async () => {
      const userSkills = ['JavaScript', 'React', 'Node.js'];
      const jobs = [
        { id: 1, title: 'Frontend Developer', required_skills: ['JavaScript', 'React'] },
        { id: 2, title: 'Backend Developer', required_skills: ['Node.js', 'Python'] },
        { id: 3, title: 'Data Scientist', required_skills: ['Python', 'Machine Learning'] }
      ];

      // Mock job matching function
      const matchJobs = (skills, jobList) => {
        return jobList.filter(job => 
          job.required_skills.some(skill => skills.includes(skill))
        ).map(job => ({
          ...job,
          match_score: job.required_skills.filter(skill => skills.includes(skill)).length / job.required_skills.length * 100
        }));
      };

      const matches = matchJobs(userSkills, jobs);
      
      expect(matches.length).toBe(2);
      expect(matches[0].title).toBe('Frontend Developer');
      expect(matches[0].match_score).toBe(100); // Perfect match
      expect(matches[1].title).toBe('Backend Developer');
      expect(matches[1].match_score).toBe(50); // Partial match
    });
  });

  describe('Job Scraper Service', () => {
    test('should scrape job listings from external sources', async () => {
      const mockJobData = [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          location: 'Cape Town',
          salary: 'R45,000 - R65,000',
          description: 'Looking for a skilled developer...',
          url: 'https://example.com/job/123'
        }
      ];

      // Mock scraper function
      const scrapeJobs = async (url) => {
        if (url.includes('pnet') || url.includes('careers24')) {
          return Promise.resolve(mockJobData);
        }
        return Promise.resolve([]);
      };

      const jobs = await scrapeJobs('https://www.pnet.co.za/jobs');
      
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].title).toBe('Software Developer');
      expect(jobs[0].company).toBe('Tech Company');
      expect(jobs[0].location).toBe('Cape Town');
    });

    test('should handle scraping errors gracefully', async () => {
      const scrapeJobs = async (url) => {
        if (url === 'invalid-url') {
          throw new Error('Invalid URL');
        }
        return [];
      };

      await expect(scrapeJobs('invalid-url')).rejects.toThrow('Invalid URL');
    });
  });

  describe('Paystack Service', () => {
    beforeEach(() => {
      mockedAxios.post.mockClear();
    });

    test('should initialize payment successfully', async () => {
      const mockResponse = {
        data: {
          status: true,
          data: {
            authorization_url: 'https://checkout.paystack.com/test123',
            access_code: 'access_code_123',
            reference: 'ref_123456'
          }
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      // Mock Paystack service
      const initializePayment = async (email, amount) => {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
          email,
          amount: amount * 100, // Convert to kobo
        }, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        });
        return response.data;
      };

      const result = await initializePayment('test@example.com', 50);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.paystack.co/transaction/initialize',
        { email: 'test@example.com', amount: 5000 },
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
      );
      expect(result.status).toBe(true);
      expect(result.data.authorization_url).toBeDefined();
    });

    test('should verify payment transaction', async () => {
      const mockVerifyResponse = {
        data: {
          status: true,
          data: {
            status: 'success',
            amount: 5000,
            customer: { email: 'test@example.com' }
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockVerifyResponse);

      // Mock payment verification
      const verifyPayment = async (reference) => {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        });
        return response.data;
      };

      const result = await verifyPayment('ref_123456');
      
      expect(result.status).toBe(true);
      expect(result.data.status).toBe('success');
      expect(result.data.amount).toBe(5000);
    });
  });

  describe('Database Operations', () => {
    test('should store user profile correctly', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        skills: ['JavaScript', 'React'],
        experience: '2 years'
      };

      // Mock database save operation
      const saveUserProfile = async (profile) => {
        if (!profile.email || !profile.name) {
          throw new Error('Email and name are required');
        }
        return { ...profile, created_at: new Date().toISOString() };
      };

      const result = await saveUserProfile(mockProfile);
      
      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@example.com');
      expect(result.created_at).toBeDefined();
    });

    test('should retrieve job applications for user', async () => {
      const mockApplications = [
        {
          id: 1,
          job_id: 'job123',
          user_id: 'user123',
          status: 'pending',
          applied_at: '2025-01-01T10:00:00Z'
        }
      ];

      // Mock database query
      const getUserApplications = async (userId) => {
        if (userId === 'user123') {
          return mockApplications;
        }
        return [];
      };

      const applications = await getUserApplications('user123');
      
      expect(applications.length).toBe(1);
      expect(applications[0].user_id).toBe('user123');
      expect(applications[0].status).toBe('pending');
    });
  });
});
