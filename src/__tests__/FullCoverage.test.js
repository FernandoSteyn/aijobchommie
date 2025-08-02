import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock modules to ensure we can test the actual button clicks
jest.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [],
          error: null
        }))
      }))
    }))
  }
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  }
}));

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({ scope: '/' })),
  },
  writable: true,
});

describe('100% Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset DOM class list
    document.documentElement.className = '';
    
    // Reset window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  test('covers handleLogout function execution', async () => {
    const { supabase } = require('../services/supabase');
    
    // Set up authenticated session
    const mockSession = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'mock-token'
    };
    
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    supabase.auth.signOut.mockResolvedValue({ error: null });

    render(<App />);

    // Wait for dashboard to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    // Find and click the logout button - this will hit lines 15 and 31
    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
    
    fireEvent.click(logoutButton);

    // Verify the signOut function was called (line 31)
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  test('covers toggleTheme function execution', async () => {
    const { supabase } = require('../services/supabase');
    
    // Set up authenticated session
    const mockSession = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'mock-token'
    };
    
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    render(<App />);

    // Wait for dashboard to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    // Verify initial state (no dark class)
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Find and click the theme toggle button - this will hit lines 16 and 35
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
    
    fireEvent.click(themeToggle);

    // Verify the dark class was added (line 35)
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click again to toggle back
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('covers both button clicks in sequence for complete line coverage', async () => {
    const { supabase } = require('../services/supabase');
    
    // Set up authenticated session
    const mockSession = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'mock-token'
    };
    
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    supabase.auth.signOut.mockResolvedValue({ error: null });

    render(<App />);

    // Wait for dashboard to render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    // Test theme toggle first (covers lines 16 and 35)
    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Test logout (covers lines 15 and 31)
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  test('covers handleResize function execution - line 88', async () => {
    const { supabase } = require('../services/supabase');
    
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: 'mockUser' } } });
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_IN', { user: 'mockUser' });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('app-component')).toBeInTheDocument();
    });

    // Initial state should show desktop navigation
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();

    // Trigger resize to mobile - this will hit line 88
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Mobile width
    });
    
    fireEvent(window, new Event('resize'));

    // After resize, mobile menu should appear
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
    });
  });


  test('covers fetchSession error handling - excluded Auth error', async () => {
    const { supabase } = require('../services/supabase');

    const mockError = {
      message: 'Serious error',
    };

    supabase.auth.getSession.mockRejectedValue(mockError);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  test('covers cleanup of authListener subscription', async () => {
    const { supabase } = require('../services/supabase');

    const unsubscribeMock = jest.fn();
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: unsubscribeMock } } });

    const { unmount } = render(<App />);
    
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
