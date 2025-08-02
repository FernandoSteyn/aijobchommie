import { supabase } from '../services/supabase';

describe('Supabase Service', () => {

  test('should invoke getSession to return valid session data', async () => {
    const session = await supabase.auth.getSession();
    expect(session.data.session.user).toEqual('mockUser');
  });

  test('should handle auth state change correctly', () => {
    const callback = jest.fn();
    const subscription = supabase.auth.onAuthStateChange(callback);
    expect(callback).toHaveBeenCalledWith('SIGNED_IN', { user: 'mockUser', access_token: 'test-token' });
    expect(subscription.data.subscription.unsubscribe).toBeInstanceOf(Function);
  });

  test('should sign out correctly', async () => {
    const result = await supabase.auth.signOut();
    expect(result.error).toBeNull();
  });

  test('should handle database queries with from method', async () => {
    const query = supabase.from('test');
    expect(query).toBeDefined();
    expect(query.select).toBeInstanceOf(Function);
  });

  test('should handle select and eq chaining', async () => {
    const result = await supabase.from('test').select('*').eq('id', 1);
    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

});

