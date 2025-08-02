export const useAuth = () => ({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isAuthenticated: false,
  user: { name: 'John Doe', email: 'john@example.com' }
});
