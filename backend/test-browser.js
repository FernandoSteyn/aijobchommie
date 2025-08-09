/**
 * Test file to demonstrate browser service usage
 * Run with: node test-browser.js
 */

const { 
  getBrowser, 
  getStealthPage,
  closeBrowser,
  randomDelay,
  humanClick,
  humanType 
} = require('./services/browserService');

async function testBrowser() {
  let browser = null;
  let page = null;
  
  try {
    console.log('🧪 Testing Puppeteer Browser Service...\n');
    
    // Get browser instance (headless by default)
    // To see the browser, use: getBrowser({ headless: false })
    browser = await getBrowser({ headless: true });
    
    // Create a new stealth page
    page = await getStealthPage(browser);
    
    // Navigate to a test site
    console.log('📍 Navigating to example.com...');
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait with random delay
    console.log('⏳ Waiting with random delay...');
    await randomDelay(2, 4);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-screenshot.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as test-screenshot.png');
    
    // Test detection
    console.log('\n🔍 Testing detection evasion...');
    
    // Check if we're detected as a bot
    const isBot = await page.evaluate(() => {
      return navigator.webdriver;
    });
    console.log(`Navigator.webdriver: ${isBot === undefined ? '✅ Hidden' : '❌ Detected'}`);
    
    // Check Chrome object
    const hasChrome = await page.evaluate(() => {
      return !!window.chrome;
    });
    console.log(`Chrome object: ${hasChrome ? '✅ Present' : '❌ Missing'}`);
    
    // Check user agent
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`User Agent: ${userAgent.substring(0, 60)}...`);
    
    // Get viewport
    const viewport = await page.viewport();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    
    console.log('\n✅ Browser test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up
    if (page) await page.close();
    await closeBrowser();
  }
}

// Run test if executed directly
if (require.main === module) {
  testBrowser();
}
