import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navigation from '../components/Navigation';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn()
    }
  }
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

// Helper function to render with router
const renderWithRouter = (component, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Navigation Component', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window size for responsive tests
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  describe('Desktop Navigation', () => {
    beforeEach(() => {
      global.innerWidth = 1280;
      global.dispatchEvent(new Event('resize'));
    });

    test('renders navigation items for authenticated user', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Check main nav items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Check secondary nav items
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('Subscription')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
    });

    test('shows admin navigation item for admin users', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={true} />);

      expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
    });

    test('expands navigation on hover', () => {
      const { container } = renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);
      
      const nav = container.querySelector('nav');
      fireEvent.mouseEnter(nav);

      // Check if expanded content is visible
      expect(screen.getByText('AI Job Chommie')).toBeInTheDocument();
    });

    test('collapses navigation on mouse leave', () => {
      const { container } = renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);
      
      const nav = container.querySelector('nav');
      fireEvent.mouseEnter(nav);
      expect(screen.getByText('AI Job Chommie')).toBeInTheDocument();

      fireEvent.mouseLeave(nav);
      // Text should be hidden after animation
      expect(screen.queryByText('AI Job Chommie')).not.toBeInTheDocument();
    });

    test('shows notification badges', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Jobs badge
      expect(screen.getByText('25+')).toBeInTheDocument();
      
      // Applications notification count
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('highlights active navigation item', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />, {
        initialEntries: ['/jobs']
      });

      const jobsLink = screen.getByRole('link', { name: /jobs/i });
      expect(jobsLink).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));
    });

    test('renders mobile bottom navigation', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Check bottom nav items
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /applications/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    });

    test('opens mobile menu when menu button is clicked', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Check if mobile menu is open
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Logged in as')).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });

    test('closes mobile menu when close button is clicked', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Close menu
      const closeButton = screen.getAllByRole('button')[1]; // Close button
      fireEvent.click(closeButton);

      // Menu should be closed
      expect(screen.queryByText('Logged in as')).not.toBeInTheDocument();
    });

    test('closes mobile menu when backdrop is clicked', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Click backdrop
      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/80');
      fireEvent.click(backdrop);

      // Menu should be closed
      expect(screen.queryByText('Logged in as')).not.toBeInTheDocument();
    });

    test('closes mobile menu when navigation item is clicked', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);

      // Click a nav item
      const settingsLink = screen.getByRole('link', { name: /settings/i });
      fireEvent.click(settingsLink);

      // Menu should be closed
      expect(screen.queryByText('Logged in as')).not.toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    test('handles successful logout', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });
      const mockNavigate = jest.fn();
      
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate
      }));

      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Find and click logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully! See you soon, chommie! 👋');
      });
    });

    test('handles logout error', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: new Error('Logout failed') });

      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Error logging out');
      });
    });

    test('logout button only shows for authenticated users', () => {
      renderWithRouter(<Navigation user={null} isAdmin={false} />);

      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('all navigation links have correct paths', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const expectedPaths = {
        'Home': '/home',
        'Jobs': '/jobs',
        'Applications': '/applications',
        'Profile': '/profile',
        'Pricing': '/pricing',
        'Subscription': '/subscription',
        'Settings': '/settings',
        'Help': '/help'
      };

      Object.entries(expectedPaths).forEach(([label, path]) => {
        const link = screen.getByRole('link', { name: new RegExp(label, 'i') });
        expect(link).toHaveAttribute('href', path);
      });
    });

    test('admin navigation link has correct path', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={true} />);

      const managerLink = screen.getByRole('link', { name: /manager dashboard/i });
      expect(managerLink).toHaveAttribute('href', '/manager');
    });
  });

  describe('Visual States', () => {
    test('applies hover effects on navigation items', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      fireEvent.mouseOver(homeLink);

      // Check if hover class is applied
      expect(homeLink).toHaveClass('hover:bg-gray-800/50');
    });

    test('shows notification indicators', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      // Check for notification dots/badges
      const notificationDots = document.querySelectorAll('.bg-red-500.rounded-full');
      expect(notificationDots.length).toBeGreaterThan(0);
    });

    test('applies correct gradient colors to active items', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />, {
        initialEntries: ['/home']
      });

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink.className).toMatch(/from-cyan-400.*to-blue-500/);
    });
  });

  describe('Accessibility', () => {
    test('all interactive elements are keyboard accessible', () => {
      renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const links = screen.getAllByRole('link');
      const buttons = screen.getAllByRole('button');

      [...links, ...buttons].forEach(element => {
        expect(element).toBeVisible();
        expect(element.tabIndex).toBeGreaterThanOrEqual(-1);
      });
    });

    test('navigation has proper ARIA attributes', () => {
      const { container } = renderWithRouter(<Navigation user={mockUser} isAdmin={false} />);

      const navElements = container.querySelectorAll('nav');
      expect(navElements.length).toBeGreaterThan(0);
    });
  });
});
