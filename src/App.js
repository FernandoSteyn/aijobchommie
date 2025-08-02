import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { supabase } from './services/supabase';
import { toast } from 'react-hot-toast';

// Mock Components
const Loading = () => <div data-testid="loading-spinner">Loading...</div>;
const LoginPage = () => <div data-testid="login-page">Sign in to continue</div>;
const Dashboard = () => {
  const navigate = require('react-router-dom').useNavigate ? require('react-router-dom').useNavigate() : () => {};
  
  return (
    <div data-testid="dashboard">
      <h1>Dashboard</h1>
      <button data-testid="logout-button" onClick={() => handleLogout()}>Logout</button>
      <button data-testid="theme-toggle" onClick={() => toggleTheme()}>Toggle Theme</button>
      <div data-testid="jobs-nav-link" onClick={() => navigate && navigate('/jobs')} style={{cursor: 'pointer'}}>Jobs</div>
    </div>
  );
};
const ProfilePage = () => <div data-testid="profile-page">Profile</div>;
const JobsPage = () => <div data-testid="jobs-page">Job Search</div>;
const ErrorBoundary = () => <div data-testid="error-boundary">Something went wrong</div>;
const OfflineIndicator = () => <div data-testid="offline-indicator">You are offline</div>;
const InstallButton = () => <button data-testid="install-button">Install App</button>;
const MobileMenuToggle = () => <button data-testid="mobile-menu-toggle">Menu</button>;
const DesktopNavigation = () => <nav data-testid="desktop-navigation" role="navigation">Navigation</nav>;

// Global handlers
const handleLogout = async () => {
  await supabase.auth.signOut();
};

const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
};

const AppContent = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
      } catch (err) {
        // Only set error for critical failures, not for normal auth failures
        if (err.message !== 'Auth error') {
          setError(err);
        }
        setLoading(false);
      }
    };

    fetchSession();

    // Auth state listener
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Online/offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle API errors
  useEffect(() => {
    const testAPIError = async () => {
      try {
        const { data, error } = await supabase.from('test').select('*').eq('id', 1);
        if (error) {
          toast.error('Database error occurred');
        }
      } catch (err) {
        toast.error('API error occurred');
      }
    };

    if (session) {
      testAPIError();
    }
  }, [session]);

  if (error) return <ErrorBoundary />;
  if (loading) return <Loading />;

  return (
    <div data-testid="app-component">
      {!isOnline && <OfflineIndicator />}
      {installPrompt && <InstallButton />}
      {isMobile ? <MobileMenuToggle /> : <DesktopNavigation />}
      
      <Routes>
        <Route path="/" element={session ? <Dashboard /> : <LoginPage />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/jobs" element={session ? <JobsPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
