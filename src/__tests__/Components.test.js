import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock Components
const ThreeDCard = () => <div data-testid="3d-card">3D Card</div>;
const MarketingBanner = () => <div data-testid="marketing-banner">Limited Time Offer!</div>;
const PricingPlan = () => (
  <div>
    <div data-testid="plan">Basic Plan</div>
    <div data-testid="plan">Pro Plan</div>
    <div data-testid="plan">Enterprise Plan</div>
  </div>
);
const ManagerDashboard = () => <div data-testid="dashboard">Manager Dashboard</div>;
const Notifications = () => <div data-testid="notifications">Notifications</div>;
const AILogo = () => <img src="/logo.png" alt="AI Logo" data-testid="ai-logo" />;

describe('Individual Components', () => {
  test('ThreeDCard displays correctly', () => {
    render(<ThreeDCard />);
    expect(screen.getByTestId('3d-card')).toBeInTheDocument();
    expect(screen.getByText('3D Card')).toBeInTheDocument();
  });

  test('MarketingBanner displays content', () => {
    render(<MarketingBanner />);
    expect(screen.getByText(/limited time offer/i)).toBeInTheDocument();
    expect(screen.getByTestId('marketing-banner')).toBeInTheDocument();
  });

  test('PricingPlan renders all plans', () => {
    render(<PricingPlan />);
    const plans = screen.getAllByTestId('plan');
    expect(plans.length).toBe(3);
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Plan')).toBeInTheDocument();
  });

  test('ManagerDashboard renders correctly', () => {
    render(<ManagerDashboard />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
  });

  test('Notifications component shows notifications', () => {
    render(<Notifications />);
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('AILogo renders without errors', () => {
    render(<AILogo />);
    expect(screen.getByAltText('AI Logo')).toBeInTheDocument();
    expect(screen.getByTestId('ai-logo')).toBeInTheDocument();
  });
});
