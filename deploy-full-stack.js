#!/usr/bin/env node
/**
 * Complete Full-Stack Deployment Script
 * Deploys backend to Render and builds Android APK
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Job Chommie - Full Stack Deployment\n');

try {
  // Step 1: Check prerequisites
  console.log('✅ Checking prerequisites...');
  
  // Check if backend exists
  if (!fs.existsSync('backend/package.json')) {
    throw new Error('Backend package.json not found');
  }
  
  // Check if frontend exists
  if (!fs.existsSync('frontend/package.json')) {
    throw new Error('Frontend package.json not found');
  }
  
  // Check if Cordova project exists
  if (!fs.existsSync('aijobchommie-android/config.xml')) {
    throw new Error('Cordova config.xml not found');
  }

  // Step 2: Commit current changes
  console.log('✅ Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  try {
    execSync('git commit -m "Update frontend environment for deployed backend and prepare APK build"', { stdio: 'inherit' });
  } catch (e) {
    console.log('   - No changes to commit, proceeding...');
  }

  // Step 3: Deploy backend
  console.log('✅ Deploying backend to Render...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('\n⏳ Backend deployment initiated...');
  console.log('   Monitor at: https://dashboard.render.com/');
  console.log('   Expected completion: 3-5 minutes');

  // Step 4: Build frontend with production backend
  console.log('\n✅ Building frontend with production backend...');
  process.chdir('frontend');
  
  // Install dependencies if needed
  console.log('   - Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build production frontend
  console.log('   - Building production frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  process.chdir('..');

  // Step 5: Copy frontend build to Cordova
  console.log('✅ Preparing Cordova project...');
  
  // Update Cordova config.xml with proper app details
  const configPath = 'aijobchommie-android/config.xml';
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Fix the malformed name tag and update details
  configContent = configContent.replace(
    /<name>.*?<\/name>/,
    '<name>AI Job Chommie</name>'
  );
  configContent = configContent.replace(
    /<description>.*?<\/description>/,
    '<description>AI-powered job search assistant for South African job seekers</description>'
  );
  configContent = configContent.replace(
    /<author.*?<\/author>/s,
    '<author email="fsteyn@rocketmail.com" href="https://aijobchommie.co.za">AI Job Chommie Team</author>'
  );

  fs.writeFileSync(configPath, configContent);

  // Copy built frontend to Cordova www directory
  const frontendBuildPath = 'frontend/build';
  const cordovaWwwPath = 'aijobchommie-android/www';
  
  if (fs.existsSync(frontendBuildPath)) {
    // Remove old www content
    if (fs.existsSync(cordovaWwwPath)) {
      execSync(`rmdir /s /q "${cordovaWwwPath}"`, { stdio: 'inherit' });
    }
    
    // Copy new build
    execSync(`xcopy "${frontendBuildPath}" "${cordovaWwwPath}" /E /I /Y`, { stdio: 'inherit' });
    console.log('   - Frontend build copied to Cordova project');
  }

  // Step 6: Build Android APK
  console.log('✅ Building Android APK...');
  process.chdir('aijobchommie-android');
  
  // Check if Android platform is added
  try {
    execSync('cordova platform list', { stdio: 'pipe' });
  } catch (e) {
    console.log('   - Adding Android platform...');
    execSync('cordova platform add android', { stdio: 'inherit' });
  }

  // Build the APK
  console.log('   - Building APK (this may take a few minutes)...');
  execSync('cordova build android', { stdio: 'inherit' });
  
  process.chdir('..');

  // Step 7: Final commit and summary
  console.log('✅ Finalizing deployment...');
  execSync('git add .', { stdio: 'inherit' });
  try {
    execSync('git commit -m "Complete deployment: backend to Render, frontend updated, APK built"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
  } catch (e) {
    console.log('   - No additional changes to commit');
  }

  console.log('\n🎉 Deployment Complete!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Backend deployed to Render');
  console.log('   ✅ Frontend built with production backend URL');
  console.log('   ✅ Android APK generated');
  console.log('\n🔗 Resources:');
  console.log('   - Backend: https://aijobchommie-backend.onrender.com');
  console.log('   - Health Check: https://aijobchommie-backend.onrender.com/api/health');
  console.log('   - APK Location: aijobchommie-android/platforms/android/app/build/outputs/apk/');
  console.log('\n⚡ Next Steps:');
  console.log('   1. Test the backend health endpoint');
  console.log('   2. Install APK on Android device');
  console.log('   3. Test full app functionality');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
