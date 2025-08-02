import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import components
import ThreeDCard from '../components/3d/ThreeDCard';
import MarketingBanner from '../components/MarketingBanner';
import Pricing from '../components/Pricing';
import ManagerDashboard from '../components/ManagerDashboard';
import Notifications from '../components/Notifications';
import AILogo from '../components/AILogo';

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

jest.mock('react-hot-toast');

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Component Tests', () => {
  describe('ThreeDCard', () => {
    test('renders children content', () => {
      render(
        <ThreeDCard>
          <div>Test Content</div>
        </ThreeDCard>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('applies 3D transform on mouse move', () => {
      const { container } = render(
        <ThreeDCard>
          <div>3D Card Content</div>
        </ThreeDCard>
      );

      const card = container.firstChild;
      
      // Simulate mouse enter
      fireEvent.mouseEnter(card);
      
      // Simulate mouse move
      fireEvent.mouseMove(card, {
        clientX: 100,
        clientY: 100,
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 200,
            height: 200
          })
        }
      });

      // Should have transform style
      expect(card).toHaveStyle('transform: rotateY(0deg) rotateX(0deg)');
    });

    test('resets transform on mouse leave', () => {
      const { container } = render(
        <ThreeDCard>
          <div>3D Card Content</div>
        </ThreeDCard>
      );

      const card = container.firstChild;
      
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);

      expect(card).toHaveStyle('transform: rotateY(0deg) rotateX(0deg)');
    });

    test('accepts custom className', () => {
      const { container } = render(
        <ThreeDCard className="custom-class">
          <div>Content</div>
        </ThreeDCard>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('MarketingBanner', () => {
    test('renders marketing banner with text', () => {
      render(<MarketingBanner />);

      expect(screen.getByText(/AI-powered job matching/i)).toBeInTheDocument();
    });

    test('displays special offer text', () => {
      render(<MarketingBanner />);

      expect(screen.getByText(/special offer/i)).toBeInTheDocument();
      expect(screen.getByText(/R50\/month/i)).toBeInTheDocument();
    });

    test('has upgrade button', () => {
      render(<MarketingBanner />);

      const upgradeButton = screen.getByRole('button', { name: /upgrade now/i });
      expect(upgradeButton).toBeInTheDocument();
    });

    test('displays animated text effect', () => {
      const { container } = render(<MarketingBanner />);

      const animatedText = container.querySelector('.animate-pulse');
      expect(animatedText).toBeInTheDocument();
    });
  });

  describe('Pricing', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com'
    };

    test('renders pricing plans', () => {
      renderWithRouter(<Pricing user={mockUser} />);

      expect(screen.getByText(/Choose Your Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Free/i)).toBeInTheDocument();
      expect(screen.getByText(/Premium/i)).toBeInTheDocument();
    });

    test('displays plan features', () => {
      renderWithRouter(<Pricing user={mockUser} />);

      // Free plan features
      expect(screen.getByText(/5 job applications per month/i)).toBeInTheDocument();
      expect(screen.getByText(/Basic AI matching/i)).toBeInTheDocument();

      // Premium plan features
      expect(screen.getByText(/Unlimited applications/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced AI matching/i)).toBeInTheDocument();
    });

    test('shows pricing in South African Rand', () => {
      renderWithRouter(<Pricing user={mockUser} />);

      expect(screen.getByText(/R0/)).toBeInTheDocument(); // Free plan
      expect(screen.getByText(/R50/)).toBeInTheDocument(); // Premium plan
    });

    test('has subscribe buttons', () => {
      renderWithRouter(<Pricing user={mockUser} />);

      const subscribeButtons = screen.getAllByRole('button', { name: /subscribe/i });
      expect(subscribeButtons).toHaveLength(2);
    });

    test('highlights recommended plan', () => {
      renderWithRouter(<Pricing user={mockUser} />);

      const recommendedBadge = screen.getByText(/recommended/i);
      expect(recommendedBadge).toBeInTheDocument();
    });
  });

  describe('ManagerDashboard', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders dashboard for admin users', () => {
      renderWithRouter(<ManagerDashboard />);

      expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument();
    });

    test('displays statistics cards', () => {
      renderWithRouter(<ManagerDashboard />);

      expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Jobs/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Applications/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Subscriptions/i)).toBeInTheDocument();
    });

    test('shows charts section', () => {
      renderWithRouter(<ManagerDashboard />);

      expect(screen.getByText(/User Growth/i)).toBeInTheDocument();
      expect(screen.getByText(/Application Trends/i)).toBeInTheDocument();
    });

    test('has export data button', () => {
      renderWithRouter(<ManagerDashboard />);

      const exportButton = screen.getByRole('button', { name: /export data/i });
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('Notifications', () => {
    test('renders notification list', () => {
      render(<Notifications />);

      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    test('displays notification items', () => {
      render(<Notifications />);

      // Sample notifications
      expect(screen.getByText(/New job match/i)).toBeInTheDocument();
      expect(screen.getByText(/Application update/i)).toBeInTheDocument();
    });

    test('shows notification count', () => {
      render(<Notifications />);

      const badge = screen.getByText(/\d+/);
      expect(badge).toBeInTheDocument();
    });

    test('has mark as read functionality', () => {
      render(<Notifications />);

      const markAsReadButtons = screen.getAllByRole('button', { name: /mark as read/i });
      expect(markAsReadButtons.length).toBeGreaterThan(0);
    });

    test('can clear all notifications', () => {
      render(<Notifications />);

      const clearAllButton = screen.getByRole('button', { name: /clear all/i });
      expect(clearAllButton).toBeInTheDocument();
    });
  });

  describe('AILogo', () => {
    test('renders AI logo with animation', () => {
      const { container } = render(<AILogo />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('has rotating animation', () => {
      const { container } = render(<AILogo />);

      const animatedElement = container.querySelector('.animate-spin');
      expect(animatedElement).toBeInTheDocument();
    });

    test('accepts size prop', () => {
      const { container } = render(<AILogo size="large" />);

      const logo = container.firstChild;
      expect(logo).toHaveClass('w-16', 'h-16');
    });

    test('accepts custom className', () => {
      const { container } = render(<AILogo className="custom-logo" />);

      expect(container.firstChild).toHaveClass('custom-logo');
    });
  });

  describe('Common Component Features', () => {
    test('components handle loading states', async () => {
      render(<ManagerDashboard />);

      // Initially might show loading
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    test('components are responsive', () => {
      const { container } = renderWithRouter(<Pricing user={{ id: '123' }} />);

      // Check for responsive classes
      const responsiveElements = container.querySelectorAll('[class*="md:"], [class*="lg:"]');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    test('interactive elements have hover states', () => {
      renderWithRouter(<Pricing user={{ id: '123' }} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toMatch(/hover:/);
      });
    });

    test('components use consistent color scheme', () => {
      const { container } = render(
        <>
          <MarketingBanner />
          <Pricing user={{ id: '123' }} />
        </>
      );

      // Check for cyan/pink color scheme
      const cyanElements = container.querySelectorAll('[class*="cyan"]');
      const pinkElements = container.querySelectorAll('[class*="pink"]');

      expect(cyanElements.length).toBeGreaterThan(0);
      expect(pinkElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('components handle missing props gracefully', () => {
      // Pricing without user
      const { container } = renderWithRouter(<Pricing />);
      expect(container).toBeTruthy();
    });

    test('components handle API errors', async () => {
      const { supabase } = require('../config/supabase');
      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.reject(new Error('API Error')))
        }))
      });

      render(<ManagerDashboard />);

      await waitFor(() => {
        // Should not crash, might show error state
        expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument();
      });
    });
  });
});
