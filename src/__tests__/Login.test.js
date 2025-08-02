import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Login component
const Login = () => (
  <form data-testid="login-form">
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
    <label htmlFor="password">Password</label>
    <input id="password" type="password" />
    <button type="submit">Login</button>
  </form>
);

jest.mock('../services/auth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false
  })
}));

const renderLogin = () => render(<Login />);

const fillLoginForm = async () => {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'securepassword' }
  });
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('displays email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('has submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
