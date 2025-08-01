import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './config/supabase';

// Components
import Login from './components/Login';
import Pricing from './components/Pricing';
import MarketingBanner from './components/MarketingBanner';
import ManagerDashboard from './components/ManagerDashboard';

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
        
        {/* Marketing Banner - show on all pages except manager dashboard */}
        {window.location.pathname !== '/manager' && <MarketingBanner />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/pricing"
            element={user ? <Pricing user={user} /> : <Navigate to="/login" replace />}
          />
          
          {/* Admin Routes */}
          <Route
            path="/manager"
            element={isAdmin ? <ManagerDashboard /> : <Navigate to="/login" replace />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
