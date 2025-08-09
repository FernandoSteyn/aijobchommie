// Health check utility to diagnose common issues
export const performHealthCheck = () => {
  const results = {
    environment: {},
    supabase: {},
    network: {},
    storage: {},
    permissions: {},
    errors: []
  };

  // Check environment variables
  results.environment = {
    supabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
    supabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
    apiUrl: !!process.env.REACT_APP_API_URL,
    nodeEnv: process.env.NODE_ENV
  };

  // Check network connectivity
  results.network = {
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled
  };

  // Check localStorage availability
  try {
    const testKey = 'ajc_health_check';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    results.storage.localStorage = true;
  } catch (e) {
    results.storage.localStorage = false;
    results.errors.push('localStorage not available: ' + e.message);
  }

  // Check sessionStorage availability
  try {
    const testKey = 'ajc_health_check';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    results.storage.sessionStorage = true;
  } catch (e) {
    results.storage.sessionStorage = false;
    results.errors.push('sessionStorage not available: ' + e.message);
  }

  // Check for common browser features
  results.permissions = {
    geolocation: !!navigator.geolocation,
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    indexedDB: 'indexedDB' in window,
    webGL: !!window.WebGLRenderingContext
  };

  // Check for errors in localStorage
  try {
    const storedErrors = localStorage.getItem('ajc_errors');
    if (storedErrors) {
      const errors = JSON.parse(storedErrors);
      results.recentErrors = errors.slice(-5); // Last 5 errors
    }
  } catch (e) {
    results.errors.push('Cannot read error history: ' + e.message);
  }

  return results;
};

// Display health check results in console
export const logHealthCheck = () => {
  const results = performHealthCheck();
  console.group('🏥 Frontend Health Check');
  
  console.group('🌍 Environment');
  console.table(results.environment);
  console.groupEnd();
  
  console.group('🌐 Network');
  console.table(results.network);
  console.groupEnd();
  
  console.group('💾 Storage');
  console.table(results.storage);
  console.groupEnd();
  
  console.group('🔐 Permissions');
  console.table(results.permissions);
  console.groupEnd();
  
  if (results.errors.length > 0) {
    console.group('❌ Errors');
    results.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  if (results.recentErrors && results.recentErrors.length > 0) {
    console.group('📝 Recent Errors');
    results.recentErrors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return results;
};

// Get recommendations based on health check
export const getRecommendations = (healthCheck) => {
  const recommendations = [];
  
  if (!healthCheck.environment.supabaseUrl) {
    recommendations.push('⚠️  Missing REACT_APP_SUPABASE_URL environment variable');
  }
  
  if (!healthCheck.environment.supabaseKey) {
    recommendations.push('⚠️  Missing REACT_APP_SUPABASE_ANON_KEY environment variable');
  }
  
  if (!healthCheck.network.online) {
    recommendations.push('🔌 You are offline. Check your internet connection.');
  }
  
  if (!healthCheck.storage.localStorage) {
    recommendations.push('💾 localStorage is not available. Some features may not work.');
  }
  
  if (!healthCheck.permissions.serviceWorker) {
    recommendations.push('⚙️  Service Workers not supported. PWA features unavailable.');
  }
  
  if (healthCheck.recentErrors && healthCheck.recentErrors.length > 0) {
    recommendations.push('🐛 Recent errors detected. Check console for details.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed! Everything looks good.');
  }
  
  return recommendations;
};

export default {
  performHealthCheck,
  logHealthCheck,
  getRecommendations
};
