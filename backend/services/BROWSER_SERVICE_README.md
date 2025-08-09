# 🤖 Puppeteer Browser Service with Anti-Detection

A robust Puppeteer setup with stealth features for undetectable web scraping.

## ✨ Features

- **Stealth Mode**: Uses puppeteer-extra-plugin-stealth to avoid detection
- **Random User Agents**: 12+ different user agent strings (Chrome, Firefox, Safari, Edge)
- **Random Viewports**: 8 different common screen resolutions
- **Human-like Behavior**:
  - Random delays between actions (2-5 seconds)
  - Natural mouse movements with jitter
  - Realistic typing with variable speed
  - Random click positions within elements
- **Auto-recovery**: Retries with conservative settings on failure
- **Singleton Pattern**: Reuses browser instance for efficiency
- **Clean Shutdown**: Proper cleanup on process termination

## 📦 Installation

```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer-extra-plugin-anonymize-ua
```

## 🚀 Basic Usage

```javascript
const { getBrowser, getStealthPage, closeBrowser, randomDelay } = require('./services/browserService');

async function scrapeWebsite() {
  const browser = await getBrowser();
  const page = await getStealthPage(browser);
  
  await page.goto('https://example.com');
  await randomDelay(2, 5); // Wait 2-5 seconds
  
  // Your scraping logic here
  
  await closeBrowser();
}
```

## 📚 API Reference

### Core Functions

#### `getBrowser(options)`
Returns a configured browser instance with anti-detection features.

**Options:**
- `headless`: Boolean (default: true) - Run in headless mode
- `forceNew`: Boolean (default: false) - Force new browser instance
- `args`: Array - Additional Chrome arguments
- `executablePath`: String - Custom Chrome executable path

**Example:**
```javascript
const browser = await getBrowser({ 
  headless: false,  // Show browser window
  forceNew: true    // Create new instance
});
```

#### `getStealthPage(browser)`
Creates a new page with random viewport and user agent.

```javascript
const page = await getStealthPage(browser);
```

#### `closeBrowser()`
Safely closes the browser instance.

```javascript
await closeBrowser();
```

### Human-like Actions

#### `randomDelay(min, max)`
Creates a random delay between min and max seconds.

```javascript
await randomDelay(2, 5); // Wait 2-5 seconds
```

#### `humanMouseMove(page, startX, startY, endX, endY)`
Simulates natural mouse movement with jitter.

```javascript
await humanMouseMove(page, 100, 100, 500, 300);
```

#### `humanClick(page, selector)`
Clicks element with human-like behavior.

```javascript
await humanClick(page, 'button.submit');
```

#### `humanType(page, selector, text)`
Types text with realistic delays and occasional pauses.

```javascript
await humanType(page, 'input#search', 'web scraping puppeteer');
```

## 🛡️ Anti-Detection Features

### What's Hidden:
- ✅ `navigator.webdriver` property removed
- ✅ Chrome automation indicators disabled
- ✅ WebGL vendor spoofing
- ✅ Plugin enumeration protection
- ✅ Canvas fingerprint protection
- ✅ WebRTC leak prevention
- ✅ Timezone spoofing
- ✅ Language inconsistencies fixed

### Chrome Arguments Used:
- `--disable-blink-features=AutomationControlled`
- `--disable-features=IsolateOrigins,site-per-process`
- `--disable-web-security`
- `--no-sandbox`
- And 15+ more optimization flags

## 💡 Usage Examples

### Example 1: Simple Scraping
```javascript
const { getBrowser, getStealthPage, closeBrowser } = require('./services/browserService');

async function scrapeJobListings() {
  const browser = await getBrowser();
  const page = await getStealthPage(browser);
  
  await page.goto('https://jobsite.com/listings');
  
  // Wait for content to load
  await page.waitForSelector('.job-card');
  
  // Extract job data
  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.job-card')).map(card => ({
      title: card.querySelector('.title')?.textContent,
      company: card.querySelector('.company')?.textContent,
      salary: card.querySelector('.salary')?.textContent
    }));
  });
  
  console.log(`Found ${jobs.length} jobs`);
  
  await closeBrowser();
  return jobs;
}
```

### Example 2: Form Submission
```javascript
const { getBrowser, humanClick, humanType, randomDelay } = require('./services/browserService');

async function submitApplication() {
  const browser = await getBrowser({ headless: false });
  const page = await getStealthPage(browser);
  
  await page.goto('https://jobsite.com/apply');
  
  // Fill form with human-like typing
  await humanType(page, 'input[name="name"]', 'John Doe');
  await randomDelay(1, 2);
  
  await humanType(page, 'input[name="email"]', 'john@example.com');
  await randomDelay(1, 2);
  
  // Click submit with human-like behavior
  await humanClick(page, 'button[type="submit"]');
  
  await page.waitForNavigation();
  console.log('Application submitted!');
  
  await closeBrowser();
}
```

### Example 3: Handling Multiple Pages
```javascript
async function scrapeMultiplePages() {
  const browser = await getBrowser();
  const urls = ['https://site1.com', 'https://site2.com', 'https://site3.com'];
  
  for (const url of urls) {
    const page = await getStealthPage(browser);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await randomDelay(2, 4);
      
      // Scrape data...
      
      await page.close();
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      await page.close();
    }
  }
  
  await closeBrowser();
}
```

## 🔧 Environment Variables

- `BLOCK_RESOURCES`: Set to 'true' to block images, CSS, fonts (faster scraping)

```bash
BLOCK_RESOURCES=true node your-scraper.js
```

## ⚠️ Important Notes

1. **Rate Limiting**: Always add delays between requests to avoid being blocked
2. **Respect robots.txt**: Check website's scraping policies
3. **Error Handling**: Always wrap in try-catch blocks
4. **Resource Management**: Close pages and browser when done
5. **Legal Compliance**: Ensure you have permission to scrape the target website

## 🐛 Troubleshooting

### Browser won't launch
- Check if Chrome/Chromium is installed
- Try with `--no-sandbox` flag
- Run with `headless: true`

### Detection issues
- Rotate user agents more frequently
- Add longer delays between actions
- Use residential proxies if needed

### Memory leaks
- Always close pages after use
- Call `closeBrowser()` when done
- Monitor with `process.memoryUsage()`

## 📝 License

MIT - Use freely in your projects!
