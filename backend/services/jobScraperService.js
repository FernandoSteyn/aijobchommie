const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { supabase } = require('../config/supabase');
const cron = require('node-cron');

class JobScraperService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      this.page = await this.browser.newPage();
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await this.page.setViewport({ width: 1920, height: 1080 });
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async searchGoogleJobs() {
    try {
      if (!this.page) {
        await this.initBrowser();
      }

      console.log('Starting Google job search for South Africa...');
      
      // Navigate to Google Jobs
await this.page.goto('https://www.google.com/search?q=jobs+south+africa\u0026ibp=htl;jobs\u0026filter=nonprofit', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for job listings to load
      await this.page.waitForSelector('[jsname="DVpvXc"]', { timeout: 10000 });

      // Click on "Date posted" filter
      try {
        await this.page.click('[aria-label="Date posted"]');
        await this.page.waitForTimeout(1000);
        
        // Select "Past 24 hours" or "Yesterday"
        const dateFilters = await this.page.$$('[role="option"]');
        for (const filter of dateFilters) {
          const text = await filter.evaluate(el => el.textContent);
          if (text.includes('Past 24 hours') || text.includes('Yesterday')) {
            await filter.click();
            break;
          }
        }
        await this.page.waitForTimeout(2000);
      } catch (error) {
        console.log('Date filter not available, continuing...');
      }

      // Scroll to load more jobs
      let previousHeight = 0;
      let currentHeight = await this.page.evaluate('document.body.scrollHeight');
      let scrollAttempts = 0;

      while (previousHeight !== currentHeight && scrollAttempts < 10) {
        previousHeight = currentHeight;
        await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await this.page.waitForTimeout(2000);
        currentHeight = await this.page.evaluate('document.body.scrollHeight');
        scrollAttempts++;
      }

      // Extract job listings
      const jobs = await this.page.evaluate(() => {
        const jobElements = document.querySelectorAll('[jsname="DVpvXc"]');
        const jobList = [];

        jobElements.forEach((element) => {
          try {
            const titleElement = element.querySelector('[role="heading"] span');
            const companyElement = element.querySelector('[class*="vNEEBe"]');
            const locationElement = element.querySelector('[class*="Qk80Jf"]');
            const descriptionElement = element.querySelector('[class*="HBvzbc"]');
            
            if (titleElement && companyElement) {
              jobList.push({
                title: titleElement.textContent.trim(),
                company: companyElement.textContent.trim(),
                location: locationElement ? locationElement.textContent.trim() : 'South Africa',
                description: descriptionElement ? descriptionElement.textContent.trim() : '',
                sourceUrl: window.location.href,
                dateScraped: new Date().toISOString()
              });
            }
          } catch (err) {
            console.error('Error parsing job element:', err);
          }
        });

        return jobList;
      });

      // Click on each job to get more details
      const detailedJobs = [];
      for (let i = 0; i < Math.min(jobs.length, 50); i++) { // Limit to 50 jobs to avoid timeout
        try {
          const jobElements = await this.page.$$('[jsname="DVpvXc"]');
          if (jobElements[i]) {
            await jobElements[i].click();
            await this.page.waitForTimeout(1500);

            const jobDetails = await this.page.evaluate(() => {
              const applyButton = document.querySelector('[jsname="NbCCVc"] a');
              const fullDescription = document.querySelector('[jsname="KIg8jf"]');
              const jobType = document.querySelector('[jsname="i6xfqc"] span:nth-child(2)');
              
              // Extract contact information from description
              const descText = fullDescription ? fullDescription.textContent : '';
              const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
              const phoneRegex = /(\+27|0)[\s-]?(\d{2})[\s-]?(\d{3})[\s-]?(\d{4})/g;
              const websiteRegex = /(https?:\/\/[^\s]+)/g;
              
              const emails = descText.match(emailRegex) || [];
              const phones = descText.match(phoneRegex) || [];
              const websites = descText.match(websiteRegex) || [];

              return {
                applyUrl: applyButton ? applyButton.href : null,
                fullDescription: descText.substring(0, 2000), // Limit description length
                jobType: jobType ? jobType.textContent : null,
                contactInfo: {
                  emails: [...new Set(emails)],
                  phones: [...new Set(phones)],
                  websites: [...new Set(websites)]
                }
              };
            });

            detailedJobs.push({
              ...jobs[i],
              ...jobDetails
            });
          }
        } catch (error) {
          console.error(`Error getting details for job ${i}:`, error);
          detailedJobs.push(jobs[i]); // Add basic info if details fail
        }
      }

      return detailedJobs;
    } catch (error) {
      console.error('Error in searchGoogleJobs:', error);
      throw error;
    }
  }

  async saveJobsToDatabase(jobs) {
    try {
      // Remove duplicates based on title and company
      const uniqueJobs = jobs.filter((job, index, self) =>
        index === self.findIndex((j) => j.title === job.title && j.company === job.company)
      );

      // Save to Supabase
      const { data, error } = await supabase
        .from('jobs')
        .upsert(uniqueJobs, {
          onConflict: 'title,company',
          ignoreDuplicates: true
        });

      if (error) {
        console.error('Error saving jobs to database:', error);
        throw error;
      }

      console.log(`Successfully saved ${uniqueJobs.length} jobs to database`);
      return data;
    } catch (error) {
      console.error('Error in saveJobsToDatabase:', error);
      throw error;
    }
  }

  async runDailyScrape() {
    try {
      console.log('Starting daily job scrape...');
      await this.initBrowser();
      
      const jobs = await this.searchGoogleJobs();
      console.log(`Found ${jobs.length} jobs`);
      
      if (jobs.length > 0) {
        await this.saveJobsToDatabase(jobs);
      }
      
      await this.closeBrowser();
      console.log('Daily scrape completed successfully');
    } catch (error) {
      console.error('Error in daily scrape:', error);
      await this.closeBrowser();
      throw error;
    }
  }

  // Schedule daily scraping
  scheduleDailyScrape() {
    // Run every day at 6 AM SAST
    cron.schedule('0 6 * * *', async () => {
      console.log('Running scheduled daily scrape...');
      try {
        await this.runDailyScrape();
      } catch (error) {
        console.error('Scheduled scrape failed:', error);
      }
    }, {
      timezone: 'Africa/Johannesburg'
    });

    console.log('Daily scraper scheduled for 6 AM SAST');
  }
}

module.exports = new JobScraperService();
