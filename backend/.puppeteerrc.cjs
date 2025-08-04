const {join} = require('path');
const os = require('os');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Use cached Chromium from a custom directory to speed up builds
  cacheDirectory: join(__dirname, '.puppeteer_cache'),
  
  // Skip downloading Chromium on Render, but allow download locally if needed
  skipDownload: process.env.RENDER ? true : false,
  
  // Use specific Chrome executable path based on environment
  executablePath: process.env.RENDER 
    ? '/usr/bin/google-chrome-stable'
    : os.platform() === 'win32'
    ? 'C:\\Users\\user\\Downloads\\chrome-win\\chrome-win\\chrome.exe'
    : undefined,
};
