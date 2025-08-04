/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Cache directory for Chromium download
  cacheDirectory: process.env.PUPPETEER_CACHE_DIR || './.puppeteer_cache',
  
  // Always download Chromium for job scraping functionality
  skipDownload: false,
  
  // Executable path for different environments
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  
  // Optimized launch options for Render deployment
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor'
  ]
};
