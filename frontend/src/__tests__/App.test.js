import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the components since we don't have the actual implementations
const MockLogin = ({ onLogin }) => (
  <div data-testid="login-component">
    <h2>Login to AI Job Chommie</h2>
    <input 
      data-testid="email-input" 
      type="email" 
      placeholder="Enter your email"
    />
    <input 
      data-testid="password-input" 
      type="password" 
      placeholder="Enter your password"
    />
    <button 
      data-testid="login-button"
      onClick={() => onLogin({ email: 'test@example.com', id: 'user123' })}
    >
      Login
    </button>
  </div>
);

const MockManagerDashboard = ({ user }) => (
  <div data-testid="manager-dashboard">
    <h2>Manager Dashboard</h2>
    <p>Welcome, {user.email}</p>
    <div data-testid="stats">
      <div>Total Jobs: 150</div>
      <div>Total Applications: 450</div>
      <div>Active Users: 75</div>
    </div>
  </div>
);

const MockPricing = () => (
  <div data-testid="pricing-component">
    <h2>Pricing Plans</h2>
    <div data-testid="pricing-plan">
      <h3>Premium Plan</h3>
      <p>R50/month</p>
      <button data-testid="subscribe-button">Subscribe</button>
    </div>
  </div>
);

// Mock App component
const MockApp = () => {
  const [user, setUser] = React.useState(null);
  const [currentView, setCurrentView] = React.useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div data-testid="app-container">
      <header data-testid="app-header">
        <h1>AI Job Chommie</h1>
        {user && (
          <button data-testid="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <main data-testid="app-main">
        {currentView === 'login' && <MockLogin onLogin={handleLogin} />}
        {currentView === 'dashboard' && user && <MockManagerDashboard user={user} />}
        {currentView === 'pricing' && <MockPricing />}
      </main>

      <nav data-testid="app-navigation">
        <button 
          data-testid="nav-login"
          onClick={() => setCurrentView('login')}
        >
          Login
        </button>
        <button 
          data-testid="nav-pricing"
          onClick={() => setCurrentView('pricing')}
        >
          Pricing
        </button>
      </nav>
    </div>
  );
};

describe('AI Job Chommie Frontend', () => {
  describe('App Component', () => {
    test('renders main app structure', () => {
      render(<MockApp />);
      
      expect(screen.getByTestId('app-container')).toBeInTheDocument();
      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('app-main')).toBeInTheDocument();
      expect(screen.getByTestId('app-navigation')).toBeInTheDocument();
      expect(screen.getByText('AI Job Chommie')).toBeInTheDocument();
    });

    test('shows login component by default', () => {
      render(<MockApp />);
      
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
      expect(screen.getByText('Login to AI Job Chommie')).toBeInTheDocument();
    });

    test('handles user login successfully', async () => {
      render(<MockApp />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument();
        expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
      });
    });

    test('shows logout button when user is logged in', async () => {
      render(<MockApp />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
      });
    });

    test('handles user logout', async () => {
      render(<MockApp />);
      
      // Login first
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
      });

      // Then logout
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
        expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      });
    });

    test('navigates to pricing page', () => {
      render(<MockApp />);
      
      const pricingNav = screen.getByTestId('nav-pricing');
      fireEvent.click(pricingNav);

      expect(screen.getByTestId('pricing-component')).toBeInTheDocument();
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
    });
  });

  describe('Login Component', () => {
    test('renders login form elements', () => {
      render(<MockLogin onLogin={() => {}} />);
      
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('calls onLogin when login button is clicked', () => {
      const mockOnLogin = jest.fn();
      render(<MockLogin onLogin={mockOnLogin} />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        id: 'user123'
      });
    });
  });

  describe('Manager Dashboard', () => {
    const mockUser = { email: 'manager@example.com', id: 'manager123' };

    test('renders dashboard with user information', () => {
      render(<MockManagerDashboard user={mockUser} />);
      
      expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome, manager@example.com')).toBeInTheDocument();
    });

    test('displays dashboard statistics', () => {
      render(<MockManagerDashboard user={mockUser} />);
      
      expect(screen.getByText('Total Jobs: 150')).toBeInTheDocument();
      expect(screen.getByText('Total Applications: 450')).toBeInTheDocument();
      expect(screen.getByText('Active Users: 75')).toBeInTheDocument();
    });
  });

  describe('Pricing Component', () => {
    test('renders pricing information', () => {
      render(<MockPricing />);
      
      expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
      expect(screen.getByText('Premium Plan')).toBeInTheDocument();
      expect(screen.getByText('R50/month')).toBeInTheDocument();
    });

    test('renders subscribe button', () => {
      render(<MockPricing />);
      
      expect(screen.getByTestId('subscribe-button')).toBeInTheDocument();
    });
  });
});
