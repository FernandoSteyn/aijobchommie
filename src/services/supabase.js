export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: { user: 'mockUser', access_token: 'test-token' } } }),
    onAuthStateChange: (callback) => {
      const subscription = { unsubscribe: () => {} };
      // Simulate authenticated user
      callback('SIGNED_IN', { user: 'mockUser', access_token: 'test-token' });
      return { data: { subscription } };
    },
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({
        data: [],
        error: null
      })
    })
  })
};
