const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Use cached Chromium from a custom directory to speed up builds
  cacheDirectory: join(__dirname, '.puppeteer_cache'),
  
  // Always skip downloading Chromium on Render
  skipDownload: true,
  
  // Use specific Chrome executable path in production (Render provides one)
  executablePath: process.env.RENDER 
    ? '/usr/bin/google-chrome-stable' 
    : undefined,
};
