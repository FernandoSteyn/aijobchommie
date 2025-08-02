import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './config/supabase';

// Components
import Login from './components/Login';
import Pricing from './components/Pricing';
import MarketingBanner from './components/MarketingBanner';
import ManagerDashboard from './components/ManagerDashboard';
import Navigation from './components/Navigation';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import WelcomePage from './pages/WelcomePage';
import LoadingPage from './pages/LoadingPage';
import NotFoundPage from './pages/NotFoundPage';

// Utils
import errorHandler from './utils/errorHandler';

// Styles
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // Initialize error handler
    console.log('Error handler initialized');

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = user && ['fsteyn@rocketmail.com', 'admin@aijobchommie.co.za'].includes(user.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
          }}
        />
        
        {/* Navigation - show when user is logged in */}
        {user && <Navigation user={user} isAdmin={isAdmin} />}
        
        {/* Marketing Banner - show on all pages except manager dashboard */}
        {window.location.pathname !== '/manager' && <MarketingBanner />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to={user ? "/home" : "/welcome"} replace />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/jobs"
            element={user ? <JobsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/jobs/:id"
            element={user ? <JobsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/applications"
            element={user ? <ApplicationsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/pricing"
            element={user ? <Pricing user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/subscription"
            element={user ? <SubscriptionPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/company/:id"
            element={user ? <CompanyDetailsPage /> : <Navigate to="/login" replace />}
          />
          
          {/* Admin Routes */}
          <Route
            path="/manager"
            element={isAdmin ? <ManagerDashboard /> : <Navigate to="/login" replace />}
          />

          {/* Loading Route */}
          <Route path="/loading" element={<LoadingPage />} />

          {/* 404 - Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
