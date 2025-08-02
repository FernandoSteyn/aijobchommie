import { useAuth } from '../services/auth';

describe('Auth Service', () => {

  test('should return false for isAuthenticated', () => {
    const auth = useAuth();
    expect(auth.isAuthenticated).toBe(false);
  });

  test('should return proper user data', () => {
    const auth = useAuth();
    expect(auth.user.name).toEqual('John Doe');
    expect(auth.user.email).toEqual('john@example.com');
  });

  test('should provide login function that resolves', async () => {
    const auth = useAuth();
    await expect(auth.login()).resolves.toBeUndefined();
  });

  test('should provide logout function that resolves', async () => {
    const auth = useAuth();
    await expect(auth.logout()).resolves.toBeUndefined();
  });

});

