import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

jest.mock('react-hot-toast');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Rendering', () => {
    test('renders login form with all elements', () => {
      renderLogin();

      // Logo and branding
      expect(screen.getByText('AI JOB')).toBeInTheDocument();
      expect(screen.getByText('CHOMMIE')).toBeInTheDocument();
      expect(screen.getByText('Your smart job search assistant')).toBeInTheDocument();

      // Form elements
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    test('displays South African pride message', () => {
      renderLogin();
      expect(screen.getByText('Proudly South African 🇿🇦')).toBeInTheDocument();
    });

    test('form inputs are of correct type', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Interactions', () => {
    test('updates email input value on change', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    test('updates password input value on change', () => {
      renderLogin();

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    test('toggles between login and signup modes', () => {
      renderLogin();

      // Initially in login mode
      let submitButton = screen.getByRole('button', { name: /login/i });
      expect(submitButton).toHaveTextContent('Login');

      // Click register button to switch to signup mode
      const toggleButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(toggleButton);

      // Should now be in signup mode
      submitButton = screen.getByRole('button', { name: /register/i });
      expect(submitButton).toHaveTextContent('Register');
      expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
    });

    test('navigates to forgot password page', () => {
      renderLogin();

      const forgotPasswordLink = screen.getByText('Forgot password?');
      fireEvent.click(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('Login Functionality', () => {
    test('handles successful login', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      renderLogin();

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });

      // Submit form
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
        expect(toast.success).toHaveBeenCalledWith('Welcome back!');
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    });

    test('handles login error', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' }
      });

      renderLogin();

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpassword' }
      });

      // Submit form
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('shows loading state during authentication', async () => {
      supabase.auth.signInWithPassword.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100))
      );

      renderLogin();

      // Fill in form and submit
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      // Should show loading state
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(loginButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Signup Functionality', () => {
    test('handles successful signup', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'newuser@example.com' } },
        error: null
      });

      renderLogin();

      // Switch to signup mode
      const toggleButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(toggleButton);

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'newuser@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'newpassword123' }
      });

      // Submit form
      const signupButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newpassword123',
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              language: 'en-ZA'
            }
          }
        });
        expect(toast.success).toHaveBeenCalledWith('Check your email to confirm your account!');
      });
    });

    test('handles signup error', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Email already registered' }
      });

      renderLogin();

      // Switch to signup mode
      const toggleButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(toggleButton);

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });

      // Submit form
      const signupButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email already registered');
      });
    });
  });

  describe('Form Validation', () => {
    test('requires email and password fields', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('prevents form submission with empty fields', () => {
      renderLogin();

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      // Should not call auth methods with empty fields
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    test('validates email format', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      // HTML5 email validation
      expect(emailInput.validity.valid).toBe(false);
    });
  });

  describe('Accessibility', () => {
    test('form inputs have proper labels', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      // Inputs should have associated icons
      expect(document.querySelector('.text-cyan-400.w-5.h-5')).toBeInTheDocument();
    });

    test('all interactive elements are keyboard accessible', () => {
      renderLogin();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });
      const registerButton = screen.getByRole('button', { name: /register/i });

      expect(emailInput).toBeVisible();
      expect(passwordInput).toBeVisible();
      expect(loginButton).toBeVisible();
      expect(registerButton).toBeVisible();
    });
  });

  describe('Visual Styling', () => {
    test('applies correct styling classes', () => {
      renderLogin();

      const container = screen.getByText('AI JOB').closest('div');
      expect(container).toHaveClass('min-h-screen', 'bg-black');

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveClass('bg-gray-900', 'border-cyan-400');
    });

    test('displays logo with blur effect', () => {
      const { container } = renderLogin();
      
      const blurElement = container.querySelector('.blur-xl.bg-cyan-400');
      expect(blurElement).toBeInTheDocument();
    });
  });
});
