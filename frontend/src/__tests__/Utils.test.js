import jobService from '../services/jobService';
import errorHandler from '../utils/errorHandler';
import * as formatUtils from '../utils/format';
import { supabase } from '../config/supabase';

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn()
    }
  }
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

describe('Utility and Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('jobService', () => {
    const mockJobsData = [
      {
        id: 1,
        title: 'Senior Welder',
        company: 'ABC Industries',
        location: 'Johannesburg',
        salary: 'R25,000 - R35,000',
        type: 'Full-time',
        description: 'Experienced welder needed',
        requirements: ['5+ years experience', 'Valid certification'],
        created_at: '2024-01-01T10:00:00Z'
      },
      {
        id: 2,
        title: 'Junior Developer',
        company: 'Tech Corp',
        location: 'Cape Town',
        salary: 'R15,000 - R20,000',
        type: 'Full-time',
        description: 'Entry level developer position',
        requirements: ['Basic programming knowledge'],
        created_at: '2024-01-02T10:00:00Z'
      }
    ];

    describe('getJobs', () => {
      test('fetches all jobs successfully', async () => {
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockJobsData,
              error: null
            })
          })
        });

        const result = await jobService.getJobs();

        expect(supabase.from).toHaveBeenCalledWith('jobs');
        expect(result).toEqual(mockJobsData);
      });

      test('handles error when fetching jobs', async () => {
        const error = new Error('Database error');
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error
            })
          })
        });

        await expect(jobService.getJobs()).rejects.toThrow('Database error');
      });

      test('applies filters when fetching jobs', async () => {
        const filters = {
          location: 'Cape Town',
          type: 'Full-time',
          minSalary: 15000
        };

        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [mockJobsData[1]],
            error: null
          })
        };

        supabase.from.mockReturnValue(mockQuery);

        const result = await jobService.getJobs(filters);

        expect(mockQuery.eq).toHaveBeenCalledWith('location', 'Cape Town');
        expect(mockQuery.eq).toHaveBeenCalledWith('type', 'Full-time');
        expect(mockQuery.gte).toHaveBeenCalledWith('min_salary', 15000);
        expect(result).toEqual([mockJobsData[1]]);
      });
    });

    describe('getJobById', () => {
      test('fetches single job by ID', async () => {
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockJobsData[0],
                error: null
              })
            })
          })
        });

        const result = await jobService.getJobById(1);

        expect(supabase.from).toHaveBeenCalledWith('jobs');
        expect(result).toEqual(mockJobsData[0]);
      });

      test('handles job not found', async () => {
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            })
          })
        });

        await expect(jobService.getJobById(999)).rejects.toThrow('Not found');
      });
    });

    describe('searchJobs', () => {
      test('searches jobs by keyword', async () => {
        const searchTerm = 'welder';
        
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            or: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [mockJobsData[0]],
                error: null
              })
            })
          })
        });

        const result = await jobService.searchJobs(searchTerm);

        expect(result).toEqual([mockJobsData[0]]);
      });
    });

    describe('applyForJob', () => {
      test('submits job application successfully', async () => {
        const applicationData = {
          jobId: 1,
          userId: 'user123',
          coverLetter: 'I am interested in this position...'
        };

        supabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: { id: 'app123', ...applicationData, status: 'pending' },
              error: null
            })
          })
        });

        const result = await jobService.applyForJob(applicationData);

        expect(supabase.from).toHaveBeenCalledWith('applications');
        expect(result.status).toBe('pending');
      });

      test('prevents duplicate applications', async () => {
        const applicationData = {
          jobId: 1,
          userId: 'user123'
        };

        supabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'Duplicate application' }
            })
          })
        });

        await expect(jobService.applyForJob(applicationData))
          .rejects.toThrow('Duplicate application');
      });
    });

    describe('getRecommendedJobs', () => {
      test('fetches AI-recommended jobs for user', async () => {
        const userId = 'user123';
        const userProfile = {
          skills: ['welding', 'fabrication'],
          experience_years: 5,
          preferred_location: 'Johannesburg'
        };

        // Mock user profile fetch
        supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: userProfile,
                error: null
              })
            })
          })
        });

        // Mock jobs fetch
        supabase.from.mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockJobsData,
              error: null
            })
          })
        });

        const result = await jobService.getRecommendedJobs(userId);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('errorHandler', () => {
    test('handles generic errors', () => {
      const error = new Error('Something went wrong');
      errorHandler.handle(error);

      const toast = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });

    test('handles network errors', () => {
      const error = new Error('Network request failed');
      error.code = 'NETWORK_ERROR';
      
      errorHandler.handle(error);

      const toast = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith(
        'Network error. Please check your connection.'
      );
    });

    test('handles authentication errors', () => {
      const error = new Error('Invalid credentials');
      error.status = 401;
      
      errorHandler.handle(error);

      const toast = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith(
        'Authentication failed. Please login again.'
      );
    });

    test('handles validation errors', () => {
      const error = {
        message: 'Validation failed',
        errors: {
          email: 'Invalid email format',
          password: 'Password too short'
        }
      };
      
      errorHandler.handle(error);

      const toast = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith('Invalid email format');
      expect(toast.error).toHaveBeenCalledWith('Password too short');
    });

    test('logs errors in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Dev error');
      
      errorHandler.handle(error);
      
      expect(consoleError).toHaveBeenCalledWith('Error:', error);
      
      consoleError.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    test('handles Supabase specific errors', () => {
      const error = {
        code: 'PGRST116',
        message: 'The result contains 0 rows'
      };
      
      errorHandler.handle(error);

      const toast = require('react-hot-toast');
      expect(toast.error).toHaveBeenCalledWith('No data found');
    });
  });

  describe('formatUtils', () => {
    describe('formatCurrency', () => {
      test('formats currency in South African Rand', () => {
        expect(formatUtils.formatCurrency(25000)).toBe('R 25,000');
        expect(formatUtils.formatCurrency(1500.50)).toBe('R 1,501');
        expect(formatUtils.formatCurrency(0)).toBe('R 0');
      });

      test('handles negative values', () => {
        expect(formatUtils.formatCurrency(-1000)).toBe('-R 1,000');
      });

      test('handles null/undefined values', () => {
        expect(formatUtils.formatCurrency(null)).toBe('R 0');
        expect(formatUtils.formatCurrency(undefined)).toBe('R 0');
      });
    });

    describe('formatDate', () => {
      test('formats date in South African format', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        expect(formatUtils.formatDate(date)).toMatch(/15\/01\/2024/);
      });

      test('formats date with time', () => {
        const date = new Date('2024-01-15T14:30:00Z');
        expect(formatUtils.formatDateTime(date)).toMatch(/15\/01\/2024.*14:30/);
      });

      test('formats relative time', () => {
        const now = new Date();
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        expect(formatUtils.formatRelativeTime(hourAgo)).toBe('1 hour ago');
        expect(formatUtils.formatRelativeTime(dayAgo)).toBe('1 day ago');
      });

      test('handles invalid dates', () => {
        expect(formatUtils.formatDate('invalid')).toBe('Invalid date');
        expect(formatUtils.formatDate(null)).toBe('');
      });
    });

    describe('formatSalaryRange', () => {
      test('formats salary range string', () => {
        expect(formatUtils.formatSalaryRange(20000, 30000))
          .toBe('R 20,000 - R 30,000');
      });

      test('handles single salary value', () => {
        expect(formatUtils.formatSalaryRange(25000))
          .toBe('R 25,000');
      });

      test('adds "per month" suffix', () => {
        expect(formatUtils.formatSalaryRange(20000, 30000, true))
          .toBe('R 20,000 - R 30,000 per month');
      });
    });

    describe('formatPhoneNumber', () => {
      test('formats South African phone numbers', () => {
        expect(formatUtils.formatPhoneNumber('0821234567'))
          .toBe('082 123 4567');
        expect(formatUtils.formatPhoneNumber('27821234567'))
          .toBe('+27 82 123 4567');
      });

      test('handles invalid phone numbers', () => {
        expect(formatUtils.formatPhoneNumber('123'))
          .toBe('123');
      });
    });

    describe('truncateText', () => {
      test('truncates long text', () => {
        const longText = 'This is a very long text that needs to be truncated';
        expect(formatUtils.truncateText(longText, 20))
          .toBe('This is a very long...');
      });

      test('does not truncate short text', () => {
        const shortText = 'Short text';
        expect(formatUtils.truncateText(shortText, 20))
          .toBe('Short text');
      });

      test('handles custom ellipsis', () => {
        const text = 'Long text here';
        expect(formatUtils.truncateText(text, 10, '…'))
          .toBe('Long text…');
      });
    });

    describe('formatFileSize', () => {
      test('formats file sizes correctly', () => {
        expect(formatUtils.formatFileSize(1024)).toBe('1 KB');
        expect(formatUtils.formatFileSize(1048576)).toBe('1 MB');
        expect(formatUtils.formatFileSize(1073741824)).toBe('1 GB');
      });

      test('handles small sizes', () => {
        expect(formatUtils.formatFileSize(500)).toBe('500 B');
      });
    });

    describe('formatPercentage', () => {
      test('formats percentages', () => {
        expect(formatUtils.formatPercentage(0.75)).toBe('75%');
        expect(formatUtils.formatPercentage(0.333333)).toBe('33%');
        expect(formatUtils.formatPercentage(1)).toBe('100%');
      });

      test('handles decimal places', () => {
        expect(formatUtils.formatPercentage(0.7549, 1)).toBe('75.5%');
      });
    });
  });
});
