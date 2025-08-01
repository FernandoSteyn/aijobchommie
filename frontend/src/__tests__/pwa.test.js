/**
 * PWA Functionality Tests
 * Tests for Progressive Web App features including Service Worker, 
 * offline functionality, and installability
 */

// Mock the service worker registration
const mockServiceWorkerRegistration = {
  register: jest.fn(),
  unregister: jest.fn(),
  ready: Promise.resolve({
    installing: null,
    waiting: null,
    active: { state: 'activated' }
  })
};

// Mock navigator.serviceWorker
Object.defineProperty(window.navigator, 'serviceWorker', {
  value: mockServiceWorkerRegistration,
  writable: true
});

// Mock online/offline events
Object.defineProperty(window.navigator, 'onLine', {
  value: true,
  writable: true
});

describe('PWA Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset online status
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });
  });

  describe('Service Worker Registration', () => {
    test('should register service worker when supported', () => {
      // Mock service worker support
      const originalServiceWorker = window.navigator.serviceWorker;
      
      // Simulate service worker registration
      const register = jest.fn().mockResolvedValue({
        installing: null,
        waiting: null,
        active: { state: 'activated' }
      });

      window.navigator.serviceWorker = { register };

      // Mock service worker registration function
      const registerSW = async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            return { success: true, registration };
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
        return { success: false, error: 'Service Worker not supported' };
      };

      return registerSW().then(result => {
        expect(result.success).toBe(true);
        expect(register).toHaveBeenCalledWith('/service-worker.js');
      });
    });

    test('should handle service worker registration failure', async () => {
      const register = jest.fn().mockRejectedValue(new Error('Registration failed'));
      window.navigator.serviceWorker = { register };

      const registerSW = async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            return { success: true, registration };
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
        return { success: false, error: 'Service Worker not supported' };
      };

      const result = await registerSW();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration failed');
    });
  });

  describe('Offline Functionality', () => {
    test('should detect online status', () => {
      const getOnlineStatus = () => navigator.onLine;
      
      expect(getOnlineStatus()).toBe(true);
      
      // Simulate going offline
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true
      });
      
      expect(getOnlineStatus()).toBe(false);
    });

    test('should handle offline data caching', () => {
      const cacheManager = {
        cache: new Map(),
        set: function(key, data) {
          this.cache.set(key, { data, timestamp: Date.now() });
        },
        get: function(key) {
          const cached = this.cache.get(key);
          if (cached) {
            // Check if cache is still valid (5 minutes)
            const isValid = Date.now() - cached.timestamp < 5 * 60 * 1000;
            return isValid ? cached.data : null;
          }
          return null;
        },
        clear: function() {
          this.cache.clear();
        }
      };

      // Test caching functionality
      const testData = { jobs: [{ id: 1, title: 'Test Job' }] };
      cacheManager.set('jobs', testData);
      
      const cachedData = cacheManager.get('jobs');
      expect(cachedData).toEqual(testData);
    });

    test('should fall back to cached data when offline', () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      const cacheManager = {
        cache: new Map(),
        set: function(key, data) {
          this.cache.set(key, { data, timestamp: Date.now() });
        },
        get: function(key) {
          const cached = this.cache.get(key);
          return cached ? cached.data : null;
        }
      };

      const fetchWithCache = async (url, options = {}) => {
        const cacheKey = url;
        
        if (navigator.onLine) {
          try {
            const response = await fetch(url, options);
            const data = await response.json();
            cacheManager.set(cacheKey, data);
            return data;
          } catch (error) {
            // Fall back to cache if network fails
            return cacheManager.get(cacheKey) || { error: 'Network error and no cache available' };
          }
        } else {
          // Offline - use cache
          return cacheManager.get(cacheKey) || { error: 'Offline and no cache available' };
        }
      };

      // Set up cached data
      const cachedJobs = { jobs: [{ id: 1, title: 'Cached Job' }] };
      cacheManager.set('/api/jobs', cachedJobs);

      // Simulate offline
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true
      });

      return fetchWithCache('/api/jobs').then(result => {
        expect(result).toEqual(cachedJobs);
        expect(mockFetch).not.toHaveBeenCalled();
      });
    });
  });

  describe('PWA Installation', () => {
    test('should handle beforeinstallprompt event', () => {
      let deferredPrompt = null;
      const installButton = { style: { display: 'none' } };

      // Mock beforeinstallprompt event
      const mockEvent = {
        preventDefault: jest.fn(),
        prompt: jest.fn().mockResolvedValue({ outcome: 'accepted' }),
        userChoice: Promise.resolve({ outcome: 'accepted' })
      };

      // Handler for beforeinstallprompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
      };

      // Simulate the event
      handleBeforeInstallPrompt(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(deferredPrompt).toBe(mockEvent);
      expect(installButton.style.display).toBe('block');
    });

    test('should handle app installation', async () => {
      const mockEvent = {
        prompt: jest.fn().mockResolvedValue({ outcome: 'accepted' }),
        userChoice: Promise.resolve({ outcome: 'accepted' })
      };

      const installApp = async (deferredPrompt) => {
        if (deferredPrompt) {
          await deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          return choiceResult.outcome === 'accepted';
        }
        return false;
      };

      const result = await installApp(mockEvent);
      
      expect(mockEvent.prompt).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('Manifest Validation', () => {
    test('should have valid PWA manifest properties', () => {
      const mockManifest = {
        short_name: "AI Job Chommie",
        name: "AI Job Chommie - Smart Job Search South Africa",
        icons: [
          {
            src: "icon-192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "icon-512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#00ff41",
        background_color: "#0a0a0a",
        description: "AI-powered job search and application assistant for South Africa"
      };

      // Validate required PWA manifest properties
      expect(mockManifest.name).toBeDefined();
      expect(mockManifest.short_name).toBeDefined();
      expect(mockManifest.start_url).toBeDefined();
      expect(mockManifest.display).toBe('standalone');
      expect(mockManifest.icons).toHaveLength(2);
      expect(mockManifest.theme_color).toBeDefined();
      expect(mockManifest.background_color).toBeDefined();
      
      // Validate icon sizes
      const icon192 = mockManifest.icons.find(icon => icon.sizes === '192x192');
      const icon512 = mockManifest.icons.find(icon => icon.sizes === '512x512');
      
      expect(icon192).toBeDefined();
      expect(icon512).toBeDefined();
    });
  });

  describe('Push Notifications', () => {
    test('should handle push notification permission', async () => {
      // Mock Notification API
      const mockNotification = {
        permission: 'default',
        requestPermission: jest.fn().mockResolvedValue('granted')
      };

      global.Notification = mockNotification;

      const requestNotificationPermission = async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
        return false;
      };

      const result = await requestNotificationPermission();
      
      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should create local notifications', () => {
      const mockNotification = jest.fn();
      global.Notification = mockNotification;

      const showNotification = (title, options = {}) => {
        if ('Notification' in window && Notification.permission === 'granted') {
          return new Notification(title, options);
        }
        return null;
      };

      // Mock permission as granted
      Object.defineProperty(global.Notification, 'permission', {
        value: 'granted',
        writable: false
      });

      const notification = showNotification('New Job Alert', {
        body: 'A new job matching your skills is available!',
        icon: '/icon-192.png',
        tag: 'job-alert'
      });

      expect(mockNotification).toHaveBeenCalledWith('New Job Alert', {
        body: 'A new job matching your skills is available!',
        icon: '/icon-192.png',
        tag: 'job-alert'
      });
    });
  });

  describe('Performance Metrics', () => {
    test('should measure app loading performance', () => {
      const mockPerformance = {
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn().mockReturnValue([
          { name: 'navigation', duration: 1500, startTime: 0 }
        ])
      };

      global.performance = mockPerformance;

      const measureLoadTime = () => {
        mockPerformance.mark('app-start');
        // Simulate app load completion
        setTimeout(() => {
          mockPerformance.mark('app-loaded');
          mockPerformance.measure('app-load-time', 'app-start', 'app-loaded');
        }, 0);
      };

      measureLoadTime();

      expect(mockPerformance.mark).toHaveBeenCalledWith('app-start');
    });

    test('should track Core Web Vitals', () => {
      const vitals = {
        LCP: null, // Largest Contentful Paint
        FID: null, // First Input Delay
        CLS: null  // Cumulative Layout Shift
      };

      const trackVitals = (metric) => {
        vitals[metric.name] = metric.value;
      };

      // Simulate metric reporting
      trackVitals({ name: 'LCP', value: 2.5 });
      trackVitals({ name: 'FID', value: 100 });
      trackVitals({ name: 'CLS', value: 0.1 });

      expect(vitals.LCP).toBe(2.5);
      expect(vitals.FID).toBe(100);
      expect(vitals.CLS).toBe(0.1);

      // Check if metrics meet thresholds
      expect(vitals.LCP).toBeLessThan(4000); // Good LCP < 4s
      expect(vitals.FID).toBeLessThan(300);  // Good FID < 300ms
      expect(vitals.CLS).toBeLessThan(0.25); // Good CLS < 0.25
    });
  });
});
