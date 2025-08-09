#!/usr/bin/env node

/**
 * AI Job Chommie - Frontend & Backend Connectivity Test
 * Tests all connections and configurations for Node.js 24.5.0 and npm 11.5.2
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const axios = require('axios');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

const log = (message, color = colors.white) => console.log(`${color}${message}${colors.reset}`);
const success = (message) => log(`✅ ${message}`, colors.green);
const error = (message) => log(`❌ ${message}`, colors.red);
const warning = (message) => log(`⚠️  ${message}`, colors.yellow);
const info = (message) => log(`ℹ️  ${message}`, colors.blue);
const header = (message) => log(`\n🚀 ${message}`, colors.cyan);

async function testNodeAndNpm() {
    header('Node.js and npm Version Check');
    
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        
        success(`Node.js version: ${nodeVersion}`);
        success(`npm version: ${npmVersion}`);
        
        // Check if versions meet requirements
        const nodeVersionNum = parseFloat(nodeVersion.substring(1));
        const npmVersionNum = parseFloat(npmVersion);
        
        if (nodeVersionNum >= 24.5) {
            success('Node.js version meets requirements (>=24.5.0)');
        } else {
            error(`Node.js version ${nodeVersion} is below required 24.5.0`);
        }
        
        if (npmVersionNum >= 11.5) {
            success('npm version meets requirements (>=11.5.0)');
        } else {
            error(`npm version ${npmVersion} is below required 11.5.0`);
        }
        
        return true;
    } catch (err) {
        error(`Failed to check Node/npm versions: ${err.message}`);
        return false;
    }
}

function testPackageJson() {
    header('Package.json Configuration Test');
    
    const rootPackagePath = path.join(__dirname, 'package.json');
    const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
    const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
    
    // Test root package.json
    try {
        const rootPkg = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
        success('Root package.json is valid JSON');
        
        if (rootPkg.engines && rootPkg.engines.node >= '24.5.0') {
            success(`Root package.json has correct Node.js requirement: ${rootPkg.engines.node}`);
        } else {
            warning('Root package.json should specify Node.js >= 24.5.0');
        }
    } catch (err) {
        error(`Root package.json error: ${err.message}`);
        return false;
    }
    
    // Test frontend package.json
    try {
        const frontendPkg = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
        success('Frontend package.json is valid JSON');
        
        if (frontendPkg.devDependencies && frontendPkg.devDependencies['react-scripts']) {
            success(`Frontend has react-scripts: ${frontendPkg.devDependencies['react-scripts']}`);
        } else {
            error('Frontend missing react-scripts in devDependencies');
        }
    } catch (err) {
        error(`Frontend package.json error: ${err.message}`);
        return false;
    }
    
    // Test backend package.json
    try {
        const backendPkg = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
        success('Backend package.json is valid JSON');
        
        if (backendPkg.engines && backendPkg.engines.node >= '24.5.0') {
            success(`Backend has correct Node.js requirement: ${backendPkg.engines.node}`);
        } else {
            warning('Backend package.json should specify Node.js >= 24.5.0');
        }
    } catch (err) {
        error(`Backend package.json error: ${err.message}`);
        return false;
    }
    
    return true;
}

function testFrontendDependencies() {
    header('Frontend Dependencies Test');
    
    try {
        process.chdir(path.join(__dirname, 'frontend'));
        
        // Check if node_modules exists
        if (fs.existsSync('node_modules')) {
            success('Frontend node_modules directory exists');
            
            // Check react-scripts specifically
            if (fs.existsSync('node_modules/react-scripts')) {
                success('react-scripts is properly installed');
            } else {
                error('react-scripts not found in node_modules');
                return false;
            }
        } else {
            warning('Frontend node_modules not found - dependencies may need installation');
        }
        
        // Test react-scripts availability
        try {
            const reactScriptsCheck = execSync('npm ls react-scripts', { encoding: 'utf8' });
            success('react-scripts is available via npm ls');
        } catch (err) {
            error('react-scripts not accessible via npm ls');
        }
        
        return true;
    } catch (err) {
        error(`Frontend dependencies test failed: ${err.message}`);
        return false;
    } finally {
        process.chdir(__dirname);
    }
}

function testFrontendBuild() {
    header('Frontend Build Test');
    
    try {
        process.chdir(path.join(__dirname, 'frontend'));
        
        info('Testing frontend build process...');
        const buildResult = execSync('npm run build:fast', { encoding: 'utf8', timeout: 120000 });
        
        if (buildResult.includes('The build folder is ready to be deployed')) {
            success('Frontend build completed successfully');
            
            // Check if build directory exists
            if (fs.existsSync('build')) {
                success('Build directory created');
                
                // Check for key build files
                const buildFiles = ['build/index.html', 'build/static'];
                let allFilesExist = true;
                
                buildFiles.forEach(file => {
                    if (fs.existsSync(file)) {
                        success(`Found ${file}`);
                    } else {
                        error(`Missing ${file}`);
                        allFilesExist = false;
                    }
                });
                
                return allFilesExist;
            } else {
                error('Build directory not created');
                return false;
            }
        } else {
            error('Build did not complete successfully');
            return false;
        }
    } catch (err) {
        error(`Frontend build test failed: ${err.message}`);
        return false;
    } finally {
        process.chdir(__dirname);
    }
}

async function testBackendConnection() {
    header('Backend Connection Test');
    
    const backendUrl = 'https://aijobchommie-backend.onrender.com';
    
    try {
        info(`Testing connection to ${backendUrl}...`);
        
        // Test health endpoint
        const healthResponse = await axios.get(`${backendUrl}/api/health`, { timeout: 10000 });
        
        if (healthResponse.status === 200) {
            success('Backend health check passed');
            success(`Backend status: ${healthResponse.data.status}`);
            success(`Backend environment: ${healthResponse.data.environment}`);
        } else {
            error(`Backend health check failed with status: ${healthResponse.status}`);
            return false;
        }
        
        // Test API endpoint
        const testResponse = await axios.get(`${backendUrl}/api/test`, { timeout: 10000 });
        
        if (testResponse.status === 200) {
            success('Backend test endpoint accessible');
            success(`Supabase URL configured: ${testResponse.data.hasSupabaseUrl}`);
            success(`Supabase key configured: ${testResponse.data.hasSupabaseKey}`);
        } else {
            error(`Backend test endpoint failed with status: ${testResponse.status}`);
            return false;
        }
        
        return true;
    } catch (err) {
        error(`Backend connection test failed: ${err.message}`);
        return false;
    }
}

function testEnvironmentFiles() {
    header('Environment Configuration Test');
    
    const envFiles = [
        'frontend/.env.development',
        'frontend/.env.production',
        'backend/.env.example'
    ];
    
    let allEnvFilesOk = true;
    
    envFiles.forEach(envFile => {
        const fullPath = path.join(__dirname, envFile);
        
        if (fs.existsSync(fullPath)) {
            success(`Found ${envFile}`);
            
            // Read and validate environment file content
            try {
                const envContent = fs.readFileSync(fullPath, 'utf8');
                
                if (envFile.includes('frontend/.env.development')) {
                    if (envContent.includes('REACT_APP_API_URL') && envContent.includes('SUPABASE_URL')) {
                        success('Development environment has required variables');
                    } else {
                        warning('Development environment missing some variables');
                    }
                }
            } catch (err) {
                error(`Error reading ${envFile}: ${err.message}`);
                allEnvFilesOk = false;
            }
        } else {
            warning(`Missing ${envFile}`);
        }
    });
    
    return allEnvFilesOk;
}

async function runAllTests() {
    log('\n🎯 AI Job Chommie - Comprehensive Connectivity Test', colors.magenta);
    log('=' .repeat(60), colors.magenta);
    log('Testing Node.js 24.5.0 and npm 11.5.2 compatibility\n', colors.white);
    
    const tests = [
        { name: 'Node.js and npm Versions', fn: testNodeAndNpm },
        { name: 'Package.json Configuration', fn: testPackageJson },
        { name: 'Frontend Dependencies', fn: testFrontendDependencies },
        { name: 'Environment Configuration', fn: testEnvironmentFiles },
        { name: 'Backend Connection', fn: testBackendConnection },
        { name: 'Frontend Build Process', fn: testFrontendBuild }
    ];
    
    const results = {};
    
    for (const test of tests) {
        try {
            info(`Running ${test.name}...`);
            results[test.name] = await test.fn();
        } catch (err) {
            error(`${test.name} failed: ${err.message}`);
            results[test.name] = false;
        }
    }
    
    // Summary
    header('Test Results Summary');
    
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([testName, passed]) => {
        if (passed) {
            success(`${testName}: PASSED`);
        } else {
            error(`${testName}: FAILED`);
        }
    });
    
    log(`\n📊 Overall Results: ${passed}/${total} tests passed`, colors.white);
    
    if (passed === total) {
        success('🎉 All tests passed! Your frontend and backend are properly connected.');
        success('🚀 Ready for development and deployment.');
        
        log('\n📋 Next Steps:', colors.cyan);
        log('• Run "npm start" in the frontend directory to start development', colors.white);
        log('• Your backend is online and accessible', colors.white);
        log('• Build process is working correctly', colors.white);
    } else {
        warning(`⚠️  ${total - passed} test(s) failed. Please review the issues above.`);
        
        log('\n🔧 Suggested Actions:', colors.yellow);
        if (!results['Frontend Dependencies']) {
            log('• Run "cd frontend && npm install" to install dependencies', colors.white);
        }
        if (!results['Backend Connection']) {
            log('• Check your internet connection', colors.white);
            log('• Verify backend URL is correct', colors.white);
        }
    }
    
    log('\n✨ Test completed!', colors.magenta);
}

// Run all tests
runAllTests().catch(err => {
    error(`Test suite failed: ${err.message}`);
    process.exit(1);
});
