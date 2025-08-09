/**
 * Puppeteer Browser Service with Anti-Detection Features
 * Provides a stealth browser instance for web scraping
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

// Add stealth plugin with all evasions
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

// User agents pool - diverse and recent
const USER_AGENTS = [
  // Windows Chrome
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  
  // Mac Chrome
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  
  // Windows Firefox
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
  
  // Mac Safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
  
  // Linux Chrome
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  
  // Edge
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
];

// Viewport sizes - common desktop resolutions
const VIEWPORT_SIZES = [
  { width: 1920, height: 1080 }, // Full HD
  { width: 1366, height: 768 },  // Most common
  { width: 1536, height: 864 },  // Common laptop
  { width: 1440, height: 900 },  // MacBook
  { width: 1280, height: 720 },  // HD
  { width: 1600, height: 900 },  // Common desktop
  { width: 1920, height: 1200 }, // WUXGA
  { width: 2560, height: 1440 }, // QHD
];

// Chrome launch arguments for stealth
const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-blink-features=AutomationControlled',
  '--disable-features=IsolateOrigins,site-per-process',
  '--disable-web-security',
  '--disable-gpu',
  '--window-size=1920,1080',
  '--start-maximized',
  '--disable-infobars',
  '--disable-notifications',
  '--disable-extensions',
  '--disable-default-apps',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-features=TranslateUI',
  '--disable-ipc-flooding-protection',
  '--mute-audio',
];

// Browser instance storage
let browserInstance = null;

/**
 * Get random item from array
 */
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Create random delay between min and max milliseconds
 * @param {number} min - Minimum delay in seconds (default 2)
 * @param {number} max - Maximum delay in seconds (default 5)
 * @returns {Promise} Promise that resolves after delay
 */
const randomDelay = async (min = 2, max = 5) => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulate human-like mouse movements
 * @param {Page} page - Puppeteer page instance
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 * @param {number} endY - Ending Y coordinate
 */
const humanMouseMove = async (page, startX, startY, endX, endY) => {
  const steps = Math.floor(Math.random() * 10) + 10; // 10-20 steps
  const xStep = (endX - startX) / steps;
  const yStep = (endY - startY) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const currentX = startX + (xStep * i);
    const currentY = startY + (yStep * i);
    
    // Add small random jitter for more human-like movement
    const jitterX = (Math.random() - 0.5) * 3;
    const jitterY = (Math.random() - 0.5) * 3;
    
    await page.mouse.move(
      currentX + jitterX,
      currentY + jitterY,
      { steps: Math.floor(Math.random() * 3) + 1 }
    );
    
    // Random micro-delays between movements
    if (i < steps && Math.random() > 0.7) {
      await new Promise(r => setTimeout(r, Math.random() * 50));
    }
  }
  
  // Final position without jitter
  await page.mouse.move(endX, endY);
};

/**
 * Click element with human-like behavior
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Element selector to click
 */
const humanClick = async (page, selector) => {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  const box = await element.boundingBox();
  if (!box) {
    throw new Error(`Cannot get bounding box for: ${selector}`);
  }
  
  // Random point within element bounds
  const x = box.x + (box.width * (0.3 + Math.random() * 0.4));
  const y = box.y + (box.height * (0.3 + Math.random() * 0.4));
  
  // Move to element with human-like movement
  const currentPosition = await page.evaluate(() => ({
    x: window.mouseX || 100,
    y: window.mouseY || 100
  }));
  
  await humanMouseMove(page, currentPosition.x, currentPosition.y, x, y);
  
  // Small delay before click
  await new Promise(r => setTimeout(r, Math.random() * 300 + 100));
  
  // Click with random delay between down and up
  await page.mouse.down();
  await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
  await page.mouse.up();
};

/**
 * Type text with human-like delays
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - Input selector
 * @param {string} text - Text to type
 */
const humanType = async (page, selector, text) => {
  await page.focus(selector);
  
  for (const char of text) {
    await page.keyboard.type(char);
    // Random delay between keystrokes (50-250ms)
    await new Promise(r => setTimeout(r, Math.random() * 200 + 50));
    
    // Occasionally longer pauses (thinking)
    if (Math.random() < 0.1) {
      await new Promise(r => setTimeout(r, Math.random() * 500 + 300));
    }
  }
};

/**
 * Get configured browser instance
 * @param {Object} options - Optional browser configuration
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
const getBrowser = async (options = {}) => {
  try {
    // Close existing browser if needed
    if (browserInstance && options.forceNew) {
      await browserInstance.close();
      browserInstance = null;
    }
    
    // Return existing browser if available
    if (browserInstance && browserInstance.isConnected()) {
      return browserInstance;
    }
    
    // Get random configuration
    const userAgent = getRandomItem(USER_AGENTS);
    const viewport = getRandomItem(VIEWPORT_SIZES);
    
    // Merge default options with provided options
    const browserOptions = {
      headless: options.headless !== false ? 'new' : false, // Use new headless mode
      args: [...CHROME_ARGS, ...(options.args || [])],
      ignoreHTTPSErrors: true,
      defaultViewport: null, // We'll set it per page
      executablePath: options.executablePath || puppeteer.executablePath(),
      ...options
    };
    
    console.log('🚀 Launching stealth browser...');
    console.log(`📱 User Agent: ${userAgent.substring(0, 50)}...`);
    console.log(`🖥️ Viewport: ${viewport.width}x${viewport.height}`);
    
    // Launch browser
    browserInstance = await puppeteer.launch(browserOptions);
    
    // Handle browser disconnection
    browserInstance.on('disconnected', () => {
      console.log('⚠️ Browser disconnected');
      browserInstance = null;
    });
    
    // Configure default page settings
    browserInstance.on('targetcreated', async (target) => {
      const page = await target.page();
      if (page) {
        // Set viewport
        await page.setViewport(viewport);
        
        // Set user agent
        await page.setUserAgent(userAgent);
        
        // Additional stealth settings
        await page.evaluateOnNewDocument(() => {
          // Override navigator properties
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
          });
          
          // Add Chrome object
          window.chrome = {
            runtime: {}
          };
          
          // Override permissions
          const originalQuery = window.navigator.permissions.query;
          window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
              Promise.resolve({ state: Notification.permission }) :
              originalQuery(parameters)
          );
          
          // Track mouse position for human-like movements
          window.mouseX = 100;
          window.mouseY = 100;
          document.addEventListener('mousemove', (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
          });
        });
        
        // Set extra HTTP headers
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        });
        
        // Handle dialog boxes automatically
        page.on('dialog', async dialog => {
          console.log(`📢 Dialog: ${dialog.message()}`);
          await dialog.accept();
        });
      }
    });
    
    console.log('✅ Browser launched successfully');
    return browserInstance;
    
  } catch (error) {
    console.error('❌ Browser launch failed:', error);
    browserInstance = null;
    
    // Retry with more conservative settings
    if (!options.isRetry) {
      console.log('🔄 Retrying with conservative settings...');
      return getBrowser({
        ...options,
        isRetry: true,
        headless: 'new',
        args: [...CHROME_ARGS, '--single-process', '--no-zygote']
      });
    }
    
    throw error;
  }
};

/**
 * Create a new page with stealth configuration
 * @param {Browser} browser - Browser instance
 * @returns {Promise<Page>} Configured page instance
 */
const getStealthPage = async (browser) => {
  const page = await browser.newPage();
  
  // Random viewport for this page
  const viewport = getRandomItem(VIEWPORT_SIZES);
  await page.setViewport(viewport);
  
  // Random user agent for this page
  const userAgent = getRandomItem(USER_AGENTS);
  await page.setUserAgent(userAgent);
  
  // Set request interception for blocking resources (optional)
  if (process.env.BLOCK_RESOURCES === 'true') {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const blockTypes = ['image', 'stylesheet', 'font', 'media'];
      
      if (blockTypes.includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }
  
  return page;
};

/**
 * Safely close browser instance
 */
const closeBrowser = async () => {
  if (browserInstance) {
    try {
      await browserInstance.close();
      console.log('✅ Browser closed successfully');
    } catch (error) {
      console.error('❌ Error closing browser:', error);
    } finally {
      browserInstance = null;
    }
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down browser...');
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});

// Export functions
module.exports = {
  getBrowser,
  getStealthPage,
  closeBrowser,
  randomDelay,
  humanMouseMove,
  humanClick,
  humanType,
  USER_AGENTS,
  VIEWPORT_SIZES
};
