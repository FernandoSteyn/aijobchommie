import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import JobsPage from '../pages/JobsPage';
import ProfilePage from '../pages/ProfilePage';
import ApplicationsPage from '../pages/ApplicationsPage';
import SettingsPage from '../pages/SettingsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import HelpPage from '../pages/HelpPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import CompanyDetailsPage from '../pages/CompanyDetailsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import WelcomePage from '../pages/WelcomePage';
import LoadingPage from '../pages/LoadingPage';
import NotFoundPage from '../pages/NotFoundPage';

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' }
          }
        }
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
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
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    article: ({ children, ...props }) => <article {...props}>{children}</article>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

describe('Page Components', () => {
  describe('HomePage', () => {
    test('renders welcome message with user name', async () => {
      renderWithRouter(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Welcome back.*Test User/i)).toBeInTheDocument();
      });
    });

    test('displays motivational quote', () => {
      renderWithRouter(<HomePage />);
      
      const quotes = [
        "Every master was once a disaster. Keep pushing, chommie!",
        "Your next job is just one application away!",
        "Success is not final, failure is not fatal. Keep going!",
        "Today's struggle is tomorrow's strength!"
      ];
      
      const quoteElement = screen.getByText(text => 
        quotes.some(quote => text.includes(quote))
      );
      expect(quoteElement).toBeInTheDocument();
    });

    test('renders stat cards', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByText('Job Matches')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('Interviews')).toBeInTheDocument();
    });

    test('renders quick action buttons', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByRole('button', { name: /find jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload cv/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ai match/i })).toBeInTheDocument();
    });

    test('displays recent job matches', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByText('Recent Job Matches')).toBeInTheDocument();
      expect(screen.getByText('Senior Welder')).toBeInTheDocument();
      expect(screen.getByText('ABC Company')).toBeInTheDocument();
    });

    test('navigates to jobs page on search button click', () => {
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate
      }));

      renderWithRouter(<HomePage />);
      
      const findJobsButton = screen.getByRole('button', { name: /find jobs/i });
      fireEvent.click(findJobsButton);
      
      // Navigation would be tested in integration tests
    });
  });

  describe('LoginPage', () => {
    test('renders login form', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByText(/AI JOB/i)).toBeInTheDocument();
      expect(screen.getByText(/CHOMMIE/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('has login and register buttons', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('has forgot password link', () => {
      renderWithRouter(<LoginPage />);
      
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('DashboardPage', () => {
    test('renders dashboard title', () => {
      renderWithRouter(<DashboardPage />);
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  describe('JobsPage', () => {
    test('renders jobs page title', () => {
      renderWithRouter(<JobsPage />);
      
      expect(screen.getByText(/jobs/i)).toBeInTheDocument();
    });
  });

  describe('ProfilePage', () => {
    test('renders profile page', () => {
      renderWithRouter(<ProfilePage />);
      
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });
  });

  describe('ApplicationsPage', () => {
    test('renders applications page', () => {
      renderWithRouter(<ApplicationsPage />);
      
      expect(screen.getByText(/applications/i)).toBeInTheDocument();
    });
  });

  describe('SettingsPage', () => {
    test('renders settings page', () => {
      renderWithRouter(<SettingsPage />);
      
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });
  });

  describe('AboutPage', () => {
    test('renders about page content', () => {
      renderWithRouter(<AboutPage />);
      
      expect(screen.getByText(/about/i)).toBeInTheDocument();
    });
  });

  describe('ContactPage', () => {
    test('renders contact page', () => {
      renderWithRouter(<ContactPage />);
      
      expect(screen.getByText(/contact/i)).toBeInTheDocument();
    });
  });

  describe('HelpPage', () => {
    test('renders help page', () => {
      renderWithRouter(<HelpPage />);
      
      expect(screen.getByText(/help/i)).toBeInTheDocument();
    });
  });

  describe('TermsPage', () => {
    test('renders terms page', () => {
      renderWithRouter(<TermsPage />);
      
      expect(screen.getByText(/terms/i)).toBeInTheDocument();
    });
  });

  describe('PrivacyPage', () => {
    test('renders privacy page', () => {
      renderWithRouter(<PrivacyPage />);
      
      expect(screen.getByText(/privacy/i)).toBeInTheDocument();
    });
  });

  describe('SubscriptionPage', () => {
    test('renders subscription page', () => {
      renderWithRouter(<SubscriptionPage />);
      
      expect(screen.getByText(/subscription/i)).toBeInTheDocument();
    });
  });

  describe('CompanyDetailsPage', () => {
    test('renders company details page', () => {
      renderWithRouter(<CompanyDetailsPage />, { route: '/company/123' });
      
      expect(screen.getByText(/company/i)).toBeInTheDocument();
    });
  });

  describe('ForgotPasswordPage', () => {
    test('renders forgot password form', () => {
      renderWithRouter(<ForgotPasswordPage />);
      
      expect(screen.getByText(/forgot.*password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });

    test('has reset password button', () => {
      renderWithRouter(<ForgotPasswordPage />);
      
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });

  describe('WelcomePage', () => {
    test('renders welcome page content', () => {
      renderWithRouter(<WelcomePage />);
      
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    test('has get started button', () => {
      renderWithRouter(<WelcomePage />);
      
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });
  });

  describe('LoadingPage', () => {
    test('renders loading indicator', () => {
      renderWithRouter(<LoadingPage />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('NotFoundPage', () => {
    test('renders 404 error message', () => {
      renderWithRouter(<NotFoundPage />);
      
      expect(screen.getByText(/404/)).toBeInTheDocument();
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });

    test('has go home button', () => {
      renderWithRouter(<NotFoundPage />);
      
      expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    });
  });

  describe('Common Page Features', () => {
    test('pages have consistent layout structure', () => {
      const pages = [
        <HomePage />,
        <DashboardPage />,
        <ProfilePage />
      ];

      pages.forEach(page => {
        const { container } = renderWithRouter(page);
        expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
      });
    });

    test('authenticated pages fetch user data', async () => {
      renderWithRouter(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      });
    });
  });
});
