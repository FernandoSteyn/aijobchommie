#!/usr/bin/env node

/**
 * AI Job Chommie PWA - Environment Verification Script
 * Ensures all dependencies and configurations are properly set up
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 AI Job Chommie PWA - Environment Verification');
console.log('================================================\n');

// Configuration checks
const checks = {
  packageJson: () => {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      console.log('✅ package.json loaded successfully');
      console.log(`   - Project: ${pkg.name} v${pkg.version}`);
      return true;
    } catch (error) {
      console.error('❌ package.json error:', error.message);
      return false;
    }
  },

  nodeModules: () => {
    if (fs.existsSync('node_modules')) {
      console.log('✅ node_modules directory exists');
      return true;
    } else {
      console.error('❌ node_modules directory missing');
      return false;
    }
  },

  envVariables: () => {
    const hasEnv = fs.existsSync('.env') || fs.existsSync('.env.production');
    if (hasEnv) {
      console.log('✅ Environment variables file found');
      
      // Check key variables without exposing values
      const requiredVars = [
        'REACT_APP_SUPABASE_URL',
        'REACT_APP_SUPABASE_ANON_KEY',
        'REACT_APP_API_URL'
      ];
      
      try {
        const envContent = fs.existsSync('.env') 
          ? fs.readFileSync('.env', 'utf8')
          : fs.readFileSync('.env.production', 'utf8');
        
        const missingVars = requiredVars.filter(varName => 
          !envContent.includes(varName)
        );
        
        if (missingVars.length === 0) {
          console.log('   - All required environment variables present');
          return true;
        } else {
          console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
          return false;
        }
      } catch (error) {
        console.warn('⚠️  Could not verify environment variables');
        return false;
      }
    } else {
      console.error('❌ No environment variables file found (.env or .env.production)');
      return false;
    }
  },

  capacitorConfig: () => {
    if (fs.existsSync('capacitor.config.ts') || fs.existsSync('capacitor.config.js')) {
      console.log('✅ Capacitor configuration found');
      return true;
    } else {
      console.error('❌ Capacitor configuration missing');
      return false;
    }
  },

  buildDirectory: () => {
    if (fs.existsSync('build')) {
      console.log('✅ Build directory exists');
      return true;
    } else {
      console.warn('⚠️  Build directory not found (run npm run build)');
      return false;
    }
  },

  keyDependencies: () => {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const keyDeps = [
        'react',
        'react-dom',
        '@capacitor/core',
        '@supabase/supabase-js',
        'framer-motion',
        'axios'
      ];
      
      const missing = keyDeps.filter(dep => 
        !pkg.dependencies[dep] && !pkg.devDependencies[dep]
      );
      
      if (missing.length === 0) {
        console.log('✅ All key dependencies present');
        return true;
      } else {
        console.error(`❌ Missing key dependencies: ${missing.join(', ')}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Could not verify dependencies');
      return false;
    }
  }
};

// Performance optimization checks
const performanceChecks = {
  nodeVersion: () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      console.log(`✅ Node.js version: ${nodeVersion} (compatible)`);
      return true;
    } else {
      console.warn(`⚠️  Node.js version: ${nodeVersion} (consider upgrading to v18+)`);
      return false;
    }
  },

  memoryUsage: () => {
    const usage = process.memoryUsage();
    const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
    console.log(`📊 Current memory usage: ${totalMB}MB`);
    return true;
  }
};

// Run all checks
async function runVerification() {
  console.log('🔍 Running Configuration Checks...\n');
  
  const configResults = Object.entries(checks).map(([name, check]) => {
    console.log(`Checking ${name}...`);
    const result = check();
    console.log('');
    return result;
  });
  
  console.log('⚡ Running Performance Checks...\n');
  
  const perfResults = Object.entries(performanceChecks).map(([name, check]) => {
    console.log(`Checking ${name}...`);
    const result = check();
    console.log('');
    return result;
  });
  
  const allPassed = [...configResults, ...perfResults].every(Boolean);
  
  console.log('📋 SUMMARY');
  console.log('=========');
  
  if (allPassed) {
    console.log('🎉 All checks passed! Your environment is ready.');
    console.log('\n🚀 Quick Start Commands:');
    console.log('   - Development: npm start');
    console.log('   - Build: npm run build');
    console.log('   - Mobile sync: npx cap sync');
    console.log('   - Android: npx cap open android');
  } else {
    console.log('⚠️  Some checks failed. Please address the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('   - Run: npm install');
    console.log('   - Check environment variables');
    console.log('   - Ensure all configuration files are present');
  }
  
  console.log('\n✨ Environment verification complete!');
}

// Run the verification
runVerification().catch(console.error);
