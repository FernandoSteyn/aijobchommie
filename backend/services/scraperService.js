const axios = require('axios');
const cheerio = require('cheerio');

// Puppeteer with fallback handling
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('Puppeteer not available, using fallback scraping methods');
  puppeteer = null;
}

/**
 * Get optimized browser launch options for Puppeteer
 */
function getBrowserOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // Important for Render
      '--disable-gpu'
    ],
    // Use Puppeteer's bundled Chromium or specified executable path
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  };
}

/**
 * Advanced Puppeteer-based job scraping for dynamic content
 */
async function scrapeJobPostingsAdvanced(url) {
  if (!puppeteer) {
    console.warn('Puppeteer not available, falling back to basic scraping');
    return scrapeJobPostings(url);
  }

  let browser;
  try {
    console.log('Launching browser for advanced scraping...');
    browser = await puppeteer.launch(getBrowserOptions());
    
    const page = await browser.newPage();
    
    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for job listings to load
    await page.waitForSelector('div.job-listing, .job-item, [data-job]', { timeout: 10000 });
    
    // Extract job data
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('div.job-listing, .job-item, [data-job]');
      const jobsData = [];
      
      jobElements.forEach(element => {
        const title = element.querySelector('.job-title, .title, h2, h3')?.textContent?.trim();
        const company = element.querySelector('.job-company, .company, .employer')?.textContent?.trim();
        const location = element.querySelector('.job-location, .location')?.textContent?.trim();
        const description = element.querySelector('.job-description, .description')?.textContent?.trim();
        const salary = element.querySelector('.salary, .wage, .pay')?.textContent?.trim();
        const link = element.querySelector('a')?.href;
        
        if (title && company) {
          jobsData.push({
            title,
            company,
            location: location || 'Not specified',
            description: description || '',
            salary: salary || 'Not specified',
            link: link || '',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      
      return jobsData;
    });
    
    console.log(`Successfully scraped ${jobs.length} jobs using Puppeteer`);
    return jobs;
    
  } catch (error) {
    console.error('Error in advanced scraping:', error);
    // Fallback to basic scraping
    return scrapeJobPostings(url);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Basic axios + cheerio scraping (fallback method)
 */
async function scrapeJobPostings(url) {
  try {
    console.log('Using basic scraping method...');
    // Add headers to avoid blocking
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      timeout: 15000
    });

    // Load the HTML content into cheerio
    const $ = cheerio.load(data);

    // Process and extract job postings
    const jobs = [];
    $('div.job-listing, .job-item, [data-job]').each((i, element) => {
      const title = $(element).find('.job-title, .title, h2, h3').text().trim();
      const company = $(element).find('.job-company, .company, .employer').text().trim();
      const location = $(element).find('.job-location, .location').text().trim();
      const description = $(element).find('.job-description, .description').text().trim();
      const salary = $(element).find('.salary, .wage, .pay').text().trim();
      const link = $(element).find('a').attr('href');

      if (title && company) {
        jobs.push({
          title,
          company,
          location: location || 'Not specified',
          description: description || '',
          salary: salary || 'Not specified',
          link: link || '',
          scrapedAt: new Date().toISOString()
        });
      }
    });

    console.log(`Successfully scraped ${jobs.length} jobs using basic method`);
    return jobs;
  } catch (error) {
    console.error('Error scraping job postings:', error);
    return [];
  }
}

module.exports = { 
  scrapeJobPostings,
  scrapeJobPostingsAdvanced 
};
