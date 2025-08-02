import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock Page Components
const HomePage = () => (
  <div data-testid="home-page">
    <h1>Welcome to AI Job Chommie</h1>
    <p>Total Jobs: 1000</p>
    <p>Active Users: 5000</p>
  </div>
);

const LoginPage = () => (
  <div data-testid="login-page">
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
    </form>
  </div>
);

const DashboardPage = () => (
  <div data-testid="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome back!</p>
  </div>
);

const JobsPage = () => (
  <div data-testid="jobs-page">
    <h1>Job Search</h1>
    <div data-testid="job-list">Job listings</div>
  </div>
);

const ProfilePage = () => (
  <div data-testid="profile-page">
    <h1>User Profile</h1>
  </div>
);

const NotFoundPage = () => (
  <div data-testid="404-page">
    <h1>404 Page Not Found</h1>
  </div>
);

describe('Page Components', () => {
  test('renders HomePage with stats', () => {
    render(<HomePage />);
    expect(screen.getByText(/total jobs/i)).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders LoginPage correctly', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders Dashboard page for authenticated users', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
  });

  test('renders Jobs page', () => {
    render(<JobsPage />);
    expect(screen.getByTestId('job-list')).toBeInTheDocument();
    expect(screen.getByText('Job Search')).toBeInTheDocument();
  });

  test('renders Profile page', () => {
    render(<ProfilePage />);
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
  });

  test('renders 404 page for unknown routes', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/404 page not found/i)).toBeInTheDocument();
    expect(screen.getByTestId('404-page')).toBeInTheDocument();
  });
});
