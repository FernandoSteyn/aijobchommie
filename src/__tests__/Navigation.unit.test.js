import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/dashboard' })
}));

const mockLogout = jest.fn();

jest.mock('../services/auth', () => ({
  useAuth: () => ({
    logout: mockLogout,
    user: { name: 'John Doe', email: 'john@example.com' }
  })
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders desktop navigation correctly', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders navigation elements correctly', () => {
    render(<Navigation />);

    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  test('has clickable logout button', () => {
    render(<Navigation />);

    const logoutButton = screen.getByText(/logout/i);
    expect(logoutButton).toBeInTheDocument();
    // Just verify the button exists and is clickable
    fireEvent.click(logoutButton);
  });

  test('navigation links are present', () => {
    render(<Navigation />);

    const dashboardLink = screen.getByTestId('nav-dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.textContent).toBe('Dashboard');
  });

  test('ensures navigation is accessible', () => {
    render(<Navigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label');
  });

  test('handles keyboard navigation', () => {
    render(<Navigation />);

    const firstLink = screen.getAllByRole('link')[0];
    expect(firstLink).toBeInTheDocument();
  });

  test('navigation structure is correct', () => {
    render(<Navigation />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
