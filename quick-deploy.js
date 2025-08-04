#!/usr/bin/env node
/**
 * Quick Deployment Script for Render
 * This will optimize and deploy your backend in under 5 minutes
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 AI Job Chommie - Quick Deploy to Render\n');

try {
  // Step 1: Check if we're in the right directory
  console.log('✅ Checking project structure...');
  if (!fs.existsSync('backend/package.json')) {
    throw new Error('backend/package.json not found. Run this from project root.');
  }

  // Step 2: Stage all changes
  console.log('✅ Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Step 3: Commit optimizations
  console.log('✅ Committing deployment optimizations...');
  try {
    execSync('git commit -m "Optimize Render deployment for faster build times (keep Puppeteer)"', { stdio: 'inherit' });
  } catch (e) {
    console.log('   - No changes to commit, proceeding...');
  }

  // Step 4: Push to trigger deployment
  console.log('✅ Pushing to GitHub to trigger Render deployment...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n🎉 Deployment triggered successfully!');
  console.log('\n📋 What was optimized:');
  console.log('   - Puppeteer will use system Chrome (no download needed)');
  console.log('   - Disabled npm audit and fund for faster installs');
  console.log('   - Set rootDir to backend for direct deployment');
  console.log('   - Build should complete in 3-5 minutes now');
  
  console.log('\n🔗 Monitor your deployment at:');
  console.log('   https://dashboard.render.com/');
  
  console.log('\n⚡ Expected build time: 3-5 minutes (down from 40+ minutes)');
  console.log('💡 Puppeteer functionality preserved for job scraping!');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
