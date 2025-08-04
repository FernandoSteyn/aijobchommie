#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('🚀 Starting AI Job Chommie Backend...');
console.log('📁 Current working directory:', process.cwd());

// Function to find the correct path
function findIndexFile() {
  const possiblePaths = [
    path.join(process.cwd(), 'backend', 'src', 'index.js'),
    path.join(process.cwd(), 'src', 'index.js'),
    path.join(process.cwd(), '..', 'backend', 'src', 'index.js'),
    path.join(process.cwd(), '..', 'src', 'index.js'),
    path.join(process.cwd(), '..', '..', 'backend', 'src', 'index.js')
  ];
  
  console.log('🔍 Searching for index.js in possible locations:');
  for (const filePath of possiblePaths) {
    console.log('   Checking:', filePath);
    if (fs.existsSync(filePath)) {
      console.log('✅ Found index.js at:', filePath);
      return filePath;
    }
  }
  
  return null;
}

// List current directory contents for debugging
console.log('📂 Contents of current directory:');
try {
  const contents = fs.readdirSync(process.cwd());
  contents.forEach(item => {
    const itemPath = path.join(process.cwd(), item);
    const isDir = fs.statSync(itemPath).isDirectory();
    console.log(`  ${isDir ? '📁' : '📄'} ${item}`);
  });
} catch (error) {
  console.error('Cannot read directory:', error.message);
}

// Find and start the server
const indexPath = findIndexFile();
if (!indexPath) {
  console.error('❌ Cannot find index.js in any expected location');
  console.log('🔍 Let me check parent directories...');
  
  try {
    console.log('📂 Parent directory contents:');
    const parentContents = fs.readdirSync(path.join(process.cwd(), '..'));
    parentContents.forEach(item => console.log('  -', item));
  } catch (e) {
    console.log('Cannot read parent directory');
  }
  
  process.exit(1);
}

console.log('🎯 Starting server from:', indexPath);

// Change to the directory containing the index file
const indexDir = path.dirname(indexPath);
const backendDir = path.dirname(indexDir);
console.log('📁 Changing directory to:', backendDir);
process.chdir(backendDir);

// Start the server
require(indexPath);
