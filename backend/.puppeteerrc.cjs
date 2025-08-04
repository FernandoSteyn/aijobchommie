const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Use cached Chromium from a custom directory to speed up builds
  cacheDirectory: join(__dirname, '.puppeteer_cache'),
  
  // Skip downloading Chromium if in CI/CD environment and use system Chromium instead
  skipDownload: process.env.NODE_ENV === 'production' && process.env.RENDER,
  
  // Use specific Chrome executable path in production (Render provides one)
  executablePath: process.env.NODE_ENV === 'production' && process.env.RENDER 
    ? '/usr/bin/google-chrome-stable' 
    : undefined,
};
