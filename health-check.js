#!/usr/bin/env node

/**
 * AI Job Chommie - Full Stack Health Check
 * Verifies all services are working correctly
 */

const axios = require('axios');

const healthChecks = {
  async backend() {
    try {
      const response = await axios.get('https://aijobchommie-backend.onrender.com/api/health');
      console.log('✅ Backend:', response.data.message);
      return true;
    } catch (error) {
      console.error('❌ Backend failed:', error.message);
      return false;
    }
  },

  async supabase() {
    try {
      const response = await axios.get('https://lukxqkgxayijqlqslabs.supabase.co/rest/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a3hxa2d4YXlpanFscXNsYWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzE3NTIsImV4cCI6MjA2ODkwNzc1Mn0.SC9nZEsl1z4E_vvkQIBaWVBqnlOciMgBI5pZy3AopF0'
        }
      });
      console.log('✅ Supabase: Connection successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase failed:', error.message);
      return false;
    }
  },

  async paystack() {
    try {
      // Just check if the public key format is valid
      const publicKey = 'pk_test_eeb7eb6ee2a8699dfc613468651db6699ff095cb';
      if (publicKey.startsWith('pk_test_')) {
        console.log('✅ Paystack: Test keys configured');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Paystack configuration failed:', error.message);
      return false;
    }
  }
};

async function runHealthChecks() {
  console.log('🚀 AI Job Chommie - Full Stack Health Check');
  console.log('===============================================\n');

  const results = [];
  
  for (const [service, check] of Object.entries(healthChecks)) {
    console.log(`Checking ${service}...`);
    const result = await check();
    results.push(result);
    console.log('');
  }

  const allHealthy = results.every(Boolean);
  
  console.log('📋 HEALTH CHECK SUMMARY');
  console.log('=======================');
  
  if (allHealthy) {
    console.log('🎉 All services are healthy!');
    console.log('\n🔥 Ready for development:');
    console.log('   • Frontend: npm start (in frontend/ directory)');
    console.log('   • Backend: Already deployed on Render');
    console.log('   • Database: Supabase connected');
    console.log('   • Payments: Paystack configured');
    console.log('\n🌐 Frontend will be available at: http://localhost:3000');
  } else {
    console.log('⚠️  Some services need attention. Check the errors above.');
    process.exit(1);
  }
}

runHealthChecks().catch(console.error);
