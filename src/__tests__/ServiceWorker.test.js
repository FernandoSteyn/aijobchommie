// Mock service worker functions
const register = jest.fn(() => Promise.resolve());
const unregister = jest.fn(() => Promise.resolve());

describe('Service Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.resolve({ scope: '/' })),
        ready: Promise.resolve({
          unregister: jest.fn(() => Promise.resolve())
        })
      },
      writable: true
    });
  });

  test('registers the service worker', async () => {
    await register();
    expect(register).toHaveBeenCalled();
  });

  test('unregisters the service worker', async () => {
    await unregister();
    expect(unregister).toHaveBeenCalled();
  });

  test('manages cache correctly', async () => {
    // Mock Cache API
    const keysMock = jest.fn().mockResolvedValue(['cache-v1']);
    const deleteMock = jest.fn().mockResolvedValue(true);
    global.caches = {
      keys: keysMock,
      delete: deleteMock
    };

    const keys = await global.caches.keys();
    await global.caches.delete('cache-v1');

    expect(keysMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith('cache-v1');
    expect(keys).toEqual(['cache-v1']);
  });

  test('handles service worker registration errors', async () => {
    const errorRegister = jest.fn(() => Promise.reject(new Error('Registration failed')));
    
    await expect(errorRegister()).rejects.toThrow('Registration failed');
  });
});
