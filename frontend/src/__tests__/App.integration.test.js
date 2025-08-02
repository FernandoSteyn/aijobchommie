import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import { supabase } from '../config/supabase';

// Mock Supabase
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  },
  Toaster: () => <div data-testid="toaster" />
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for auth state change
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    });
  });

  describe('Initial Loading State', () => {
    test('shows loading state while checking user', async () => {
      supabase.auth.getUser.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { user: null } }), 100))
      );

      render(<App />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    test('redirects to welcome page when not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByText(/AI JOB/i)).toBeInTheDocument();
        expect(screen.getByText(/CHOMMIE/i)).toBeInTheDocument();
      });
    });

    test('shows navigation when user is authenticated', async () => {
      const mockUser = { 
        id: '123', 
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' }
      };
      
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      });
    });

    test('handles admin user access to manager dashboard', async () => {
      const adminUser = { 
        id: '123', 
        email: 'fsteyn@rocketmail.com'
      };
      
      supabase.auth.getUser.mockResolvedValue({ data: { user: adminUser } });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      });
    });

    test('updates user state on auth state change', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      let authCallback;

      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      });

      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(<App />);
      });

      // Simulate auth state change
      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser });
      });

      await waitFor(() => {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      });
    });
  });

  describe('Routing', () => {
    test('navigates to login page', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/login']}>
            <App />
          </MemoryRouter>
        );
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      });
    });

    test('protects authenticated routes', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const protectedRoutes = [
        '/home',
        '/dashboard',
        '/jobs',
        '/profile',
        '/applications',
        '/settings',
        '/pricing',
        '/subscription'
      ];

      for (const route of protectedRoutes) {
        await act(async () => {
          render(
            <MemoryRouter initialEntries={[route]}>
              <App />
            </MemoryRouter>
          );
        });

        await waitFor(() => {
          expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        });
      }
    });

    test('allows access to public routes', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const publicRoutes = [
        { path: '/about', text: /about/i },
        { path: '/contact', text: /contact/i },
        { path: '/help', text: /help/i },
        { path: '/terms', text: /terms/i },
        { path: '/privacy', text: /privacy/i }
      ];

      for (const route of publicRoutes) {
        await act(async () => {
          render(
            <MemoryRouter initialEntries={[route.path]}>
              <App />
            </MemoryRouter>
          );
        });

        await waitFor(() => {
          expect(screen.getByText(route.text)).toBeInTheDocument();
        });
      }
    });

    test('shows 404 page for unknown routes', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/unknown-route']}>
            <App />
          </MemoryRouter>
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/404/)).toBeInTheDocument();
      });
    });
  });

  describe('Marketing Banner', () => {
    test('does not show marketing banner on manager page', async () => {
      const adminUser = { id: '123', email: 'admin@aijobchommie.co.za' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: adminUser } });

      // Mock window.location.pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/manager' },
        writable: true
      });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/manager']}>
            <App />
          </MemoryRouter>
        );
      });

      await waitFor(() => {
        expect(screen.queryByTestId('marketing-banner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles auth check errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      supabase.auth.getUser.mockRejectedValue(new Error('Auth error'));

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Error checking user:', expect.any(Error));
      });

      consoleError.mockRestore();
    });

    test('unsubscribes from auth listener on unmount', async () => {
      const unsubscribe = jest.fn();
      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe } }
      });
      
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('app-container')).toBeInTheDocument();
      });

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Conditional Rendering', () => {
    test('renders Toaster component', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
      });
    });

    test('applies correct styling classes', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        const appContainer = screen.getByTestId('app-container');
        expect(appContainer).toHaveClass('min-h-screen', 'bg-black');
      });
    });
  });
});
