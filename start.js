#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting AI Job Chommie Backend...');
console.log('📁 Current working directory:', process.cwd());
console.log('📄 Looking for backend/src/index.js...');

// Check if we're in the right directory
const backendPath = path.join(process.cwd(), 'backend');
const indexPath = path.join(backendPath, 'src', 'index.js');

console.log('🔍 Backend path:', backendPath);
console.log('🔍 Index file path:', indexPath);

// Check if the file exists
const fs = require('fs');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Cannot find backend/src/index.js at:', indexPath);
  console.log('📂 Contents of current directory:');
  try {
    const contents = fs.readdirSync(process.cwd());
    contents.forEach(item => console.log('  -', item));
  } catch (error) {
    console.error('Cannot read directory:', error.message);
  }
  process.exit(1);
}

console.log('✅ Found backend/src/index.js');
console.log('🎯 Starting server...');

// Start the actual server
process.chdir(backendPath);
require('./src/index.js');
