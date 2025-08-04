/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Download Chromium to cache directory for faster builds
  cacheDirectory: './.puppeteer_cache',
  
  // Skip Chromium download if using system Chrome
  skipDownload: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true',
  
  // Executable path for different environments
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  
  // Default launch options for Render deployment
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
};
