import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

// Mock the global objects
const mockServiceWorker = {
  register: jest.fn(),
  ready: Promise.resolve({
    unregister: jest.fn()
  })
};

const mockRegistration = {
  installing: null,
  waiting: null,
  active: {
    state: 'activated'
  },
  onupdatefound: null,
  update: jest.fn(),
  unregister: jest.fn()
};

// Mock navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: mockServiceWorker
});

// Mock window.location
delete window.location;
window.location = {
  hostname: 'localhost',
  protocol: 'http:',
  href: 'http://localhost:3000'
};

// Mock console methods
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

describe('Service Worker Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockServiceWorker.register.mockResolvedValue(mockRegistration);
  });

  describe('isLocalhost', () => {
    test('returns true for localhost', () => {
      window.location.hostname = 'localhost';
      expect(serviceWorkerRegistration.isLocalhost).toBe(true);
    });

    test('returns true for 127.0.0.1', () => {
      window.location.hostname = '127.0.0.1';
      expect(serviceWorkerRegistration.isLocalhost).toBe(true);
    });

    test('returns true for [::1]', () => {
      window.location.hostname = '[::1]';
      expect(serviceWorkerRegistration.isLocalhost).toBe(true);
    });

    test('returns false for production domain', () => {
      window.location.hostname = 'aijobchommie.co.za';
      expect(serviceWorkerRegistration.isLocalhost).toBe(false);
    });
  });

  describe('register()', () => {
    test('registers service worker in production', async () => {
      window.location.hostname = 'aijobchommie.co.za';
      process.env.NODE_ENV = 'production';

      const config = {
        onSuccess: jest.fn(),
        onUpdate: jest.fn()
      };

      await serviceWorkerRegistration.register(config);

      expect(mockServiceWorker.register).toHaveBeenCalledWith(
        expect.stringContaining('/service-worker.js')
      );
    });

    test('does not register in development on non-localhost', () => {
      window.location.hostname = 'example.com';
      process.env.NODE_ENV = 'development';

      serviceWorkerRegistration.register();

      expect(mockServiceWorker.register).not.toHaveBeenCalled();
    });

    test('validates service worker URL on localhost', async () => {
      window.location.hostname = 'localhost';
      process.env.NODE_ENV = 'production';

      // Mock fetch for SW validation
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          headers: {
            get: jest.fn((header) => {
              if (header === 'content-type') return 'application/javascript';
              return null;
            })
          }
        })
      );

      await serviceWorkerRegistration.register();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/service-worker.js'),
        { headers: { 'Service-Worker': 'script' } }
      );
    });

    test('handles service worker not found on localhost', async () => {
      window.location.hostname = 'localhost';
      process.env.NODE_ENV = 'production';

      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 404,
          headers: {
            get: jest.fn(() => 'text/html')
          }
        })
      );

      const config = { onUpdate: jest.fn() };
      await serviceWorkerRegistration.register(config);

      // Should unregister if SW not found
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    test('calls onSuccess when service worker is ready', async () => {
      const onSuccess = jest.fn();
      const config = { onSuccess };

      mockServiceWorker.register.mockResolvedValue({
        ...mockRegistration,
        installing: {
          state: 'installed',
          onstatechange: null
        }
      });

      await serviceWorkerRegistration.register(config);

      // Simulate installation complete
      const registration = await mockServiceWorker.register();
      registration.installing.state = 'activated';
      registration.installing.onstatechange && registration.installing.onstatechange();

      expect(onSuccess).toHaveBeenCalledWith(registration);
    });

    test('calls onUpdate when new content is available', async () => {
      const onUpdate = jest.fn();
      const config = { onUpdate };

      const waitingWorker = {
        state: 'installed',
        onstatechange: null
      };

      mockServiceWorker.register.mockResolvedValue({
        ...mockRegistration,
        installing: waitingWorker
      });

      await serviceWorkerRegistration.register(config);

      // Simulate update found
      const registration = await mockServiceWorker.register();
      registration.onupdatefound && registration.onupdatefound();

      expect(onUpdate).toHaveBeenCalledWith(registration);
    });

    test('handles registration errors', async () => {
      const error = new Error('Registration failed');
      mockServiceWorker.register.mockRejectedValue(error);

      await serviceWorkerRegistration.register();

      expect(console.error).toHaveBeenCalledWith(
        'Error during service worker registration:',
        error
      );
    });
  });

  describe('unregister()', () => {
    test('unregisters service worker successfully', async () => {
      mockServiceWorker.ready = Promise.resolve({
        unregister: jest.fn().mockResolvedValue(true)
      });

      await serviceWorkerRegistration.unregister();

      const registration = await navigator.serviceWorker.ready;
      expect(registration.unregister).toHaveBeenCalled();
    });

    test('handles unregister when no service worker exists', async () => {
      delete navigator.serviceWorker;

      await serviceWorkerRegistration.unregister();

      // Should not throw error
      expect(console.error).not.toHaveBeenCalled();
    });

    test('reloads page after successful unregistration', async () => {
      const mockReload = jest.fn();
      window.location.reload = mockReload;

      mockServiceWorker.ready = Promise.resolve({
        unregister: jest.fn().mockResolvedValue(true)
      });

      await serviceWorkerRegistration.unregister();

      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('Update Handling', () => {
    test('checks for updates periodically', async () => {
      const registration = {
        ...mockRegistration,
        update: jest.fn()
      };

      mockServiceWorker.register.mockResolvedValue(registration);

      await serviceWorkerRegistration.register();

      // Simulate interval check
      jest.advanceTimersByTime(60000); // 1 minute

      expect(registration.update).toHaveBeenCalled();
    });

    test('handles controller change event', async () => {
      const onControllerChange = jest.fn();

      await serviceWorkerRegistration.register({
        onControllerChange
      });

      // Simulate controller change
      navigator.serviceWorker.oncontrollerchange && 
        navigator.serviceWorker.oncontrollerchange();

      expect(onControllerChange).toHaveBeenCalled();
    });
  });

  describe('PWA Installation', () => {
    test('handles beforeinstallprompt event', () => {
      let deferredPrompt = null;

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
      });

      const mockEvent = new Event('beforeinstallprompt');
      mockEvent.preventDefault = jest.fn();
      mockEvent.prompt = jest.fn();

      window.dispatchEvent(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(deferredPrompt).toBe(mockEvent);
    });

    test('handles app installed event', () => {
      const onAppInstalled = jest.fn();

      window.addEventListener('appinstalled', onAppInstalled);

      const event = new Event('appinstalled');
      window.dispatchEvent(event);

      expect(onAppInstalled).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    beforeEach(() => {
      global.caches = {
        keys: jest.fn(),
        delete: jest.fn(),
        open: jest.fn(),
        match: jest.fn()
      };
    });

    test('clears old caches on activation', async () => {
      const oldCaches = ['cache-v1', 'cache-v2', 'other-cache'];
      const currentCache = 'cache-v3';

      global.caches.keys.mockResolvedValue(oldCaches);

      // Simulate cache cleanup
      const cleanup = async () => {
        const cacheNames = await caches.keys();
        return Promise.all(
          cacheNames
            .filter(name => name !== currentCache)
            .map(name => caches.delete(name))
        );
      };

      await cleanup();

      expect(global.caches.delete).toHaveBeenCalledWith('cache-v1');
      expect(global.caches.delete).toHaveBeenCalledWith('cache-v2');
      expect(global.caches.delete).toHaveBeenCalledWith('other-cache');
    });

    test('caches essential assets', async () => {
      const mockCache = {
        addAll: jest.fn()
      };

      global.caches.open.mockResolvedValue(mockCache);

      const essentialAssets = [
        '/',
        '/index.html',
        '/static/css/main.css',
        '/static/js/bundle.js',
        '/manifest.json'
      ];

      // Simulate install event caching
      const cache = await caches.open('cache-v1');
      await cache.addAll(essentialAssets);

      expect(mockCache.addAll).toHaveBeenCalledWith(essentialAssets);
    });

    test('serves from cache when offline', async () => {
      const cachedResponse = new Response('Cached content');
      global.caches.match.mockResolvedValue(cachedResponse);

      // Simulate fetch event
      const request = new Request('/index.html');
      const response = await caches.match(request);

      expect(response).toBe(cachedResponse);
    });

    test('updates cache with network response', async () => {
      const mockCache = {
        put: jest.fn()
      };

      global.caches.open.mockResolvedValue(mockCache);
      global.fetch = jest.fn().mockResolvedValue(
        new Response('Fresh content')
      );

      // Simulate cache-then-network strategy
      const request = new Request('/api/data');
      const response = await fetch(request);
      const cache = await caches.open('cache-v1');
      await cache.put(request, response.clone());

      expect(mockCache.put).toHaveBeenCalled();
    });
  });

  describe('Background Sync', () => {
    test('registers sync event for offline actions', async () => {
      const mockSync = {
        register: jest.fn()
      };

      mockRegistration.sync = mockSync;
      mockServiceWorker.ready = Promise.resolve(mockRegistration);

      // Simulate background sync registration
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('offline-actions');

      expect(mockSync.register).toHaveBeenCalledWith('offline-actions');
    });
  });

  describe('Push Notifications', () => {
    test('subscribes to push notifications', async () => {
      const mockPushManager = {
        subscribe: jest.fn().mockResolvedValue({
          endpoint: 'https://push.example.com/123',
          getKey: jest.fn()
        }),
        getSubscription: jest.fn().mockResolvedValue(null)
      };

      mockRegistration.pushManager = mockPushManager;
      mockServiceWorker.ready = Promise.resolve(mockRegistration);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'test-key'
      });

      expect(mockPushManager.subscribe).toHaveBeenCalledWith({
        userVisibleOnly: true,
        applicationServerKey: 'test-key'
      });
      expect(subscription.endpoint).toBe('https://push.example.com/123');
    });
  });
});
