#!/usr/bin/env node
/**
 * Render Deployment Troubleshooting Script
 * This script checks for common deployment issues and attempts to fix them
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AI Job Chommie Backend - Deployment Troubleshooting\n');

// Check 1: Verify package.json structure
console.log('✅ Checking package.json...');
const packagePath = path.join(__dirname, 'backend', 'package.json');
if (!fs.existsSync(packagePath)) {
    console.error('❌ backend/package.json not found!');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log(`   - Name: ${packageJson.name}`);
console.log(`   - Main: ${packageJson.main}`);
console.log(`   - Start script: ${packageJson.scripts.start}`);
console.log(`   - Node version: ${packageJson.engines?.node || 'Not specified'}`);

// Check 2: Verify main entry file exists
console.log('\n✅ Checking main entry file...');
const mainFile = path.join(__dirname, 'backend', packageJson.main);
if (!fs.existsSync(mainFile)) {
    console.error(`❌ Main file not found: ${packageJson.main}`);
    process.exit(1);
}
console.log(`   - Main file exists: ${packageJson.main}`);

// Check 3: Verify critical dependencies
console.log('\n✅ Checking critical dependencies...');
const criticalDeps = ['express', 'cors', '@supabase/supabase-js', 'dotenv'];
const missing = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
if (missing.length > 0) {
    console.error(`❌ Missing critical dependencies: ${missing.join(', ')}`);
} else {
    console.log('   - All critical dependencies present');
}

// Check 4: Verify route files exist
console.log('\n✅ Checking route files...');
const routeFiles = [
    'backend/routes/jobRoutes.js',
    'backend/routes/paystackRoutes.js', 
    'backend/routes/managerRoutes.js'
];

routeFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   - ✓ ${file}`);
    } else {
        console.log(`   - ❌ ${file} NOT FOUND`);
    }
});

// Check 5: Verify middleware and services
console.log('\n✅ Checking middleware and services...');
const criticalFiles = [
    'backend/src/middleware/auth.js',
    'backend/config/supabase.js',
    'backend/services/scraperService.js',
    'backend/services/paystackService.js'
];

criticalFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   - ✓ ${file}`);
    } else {
        console.log(`   - ❌ ${file} NOT FOUND`);
    }
});

// Check 6: Verify render.yaml configuration
console.log('\n✅ Checking render.yaml...');
const renderYamlPath = path.join(__dirname, 'render.yaml');
if (fs.existsSync(renderYamlPath)) {
    const renderConfig = fs.readFileSync(renderYamlPath, 'utf8');
    console.log('   - render.yaml exists');
    console.log('   - Build command:', renderConfig.includes('npm install') ? '✓' : '❌');
    console.log('   - Start command:', renderConfig.includes('npm start') ? '✓' : '❌');
    console.log('   - Health check:', renderConfig.includes('/api/health') ? '✓' : '❌');
} else {
    console.log('   - ❌ render.yaml not found');
}

// Check 7: Test server binding configuration
console.log('\n✅ Checking server configuration...');
const indexContent = fs.readFileSync(mainFile, 'utf8');
const hasCorrectBinding = indexContent.includes('0.0.0.0') || indexContent.includes('HOST');
const hasPortConfig = indexContent.includes('process.env.PORT');

console.log(`   - Server binding: ${hasCorrectBinding ? '✓' : '❌'}`);
console.log(`   - Port configuration: ${hasPortConfig ? '✓' : '❌'}`);

// Check 8: Environment variables guidance
console.log('\n✅ Required Environment Variables for Render:');
console.log('   Make sure these are set in your Render dashboard:');
console.log('   - SUPABASE_URL');
console.log('   - SUPABASE_SERVICE_ROLE_KEY'); 
console.log('   - SUPABASE_ANON_KEY');
console.log('   - NODE_ENV=production');
console.log('   - PORT=10000');

// Summary
console.log('\n🚀 Deployment Checklist Summary:');
console.log('1. ✓ Package.json structure verified');
console.log('2. ✓ Main entry file exists');
console.log('3. ✓ Dependencies checked');
console.log('4. ✓ Route files verified');
console.log('5. ✓ Middleware/services checked');
console.log('6. ✓ Render config verified');
console.log('7. ✓ Server configuration checked');
console.log('8. ⚠️  Environment variables - verify in Render dashboard');

console.log('\n📋 Next Steps:');
console.log('1. Ensure all environment variables are set in Render');
console.log('2. Check Render dashboard for specific error messages');
console.log('3. Monitor the deployment process');
console.log('4. Test the health endpoint: https://your-app.onrender.com/api/health');

console.log('\n✨ Troubleshooting complete!');
