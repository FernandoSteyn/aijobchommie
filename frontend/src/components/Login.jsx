import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import AIJobChommieLogo from './AIJobChommieLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              language: 'en-ZA' // Default to English (South Africa)
            }
          }
        });

        if (error) throw error;
        
        toast.success('Check your email to confirm your account!');
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast.success('Welcome back!');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AIJobChommieLogo 
              size={120} 
              variant="large" 
              animated={true}
              className="drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-cyan-400">AI JOB</span>
            <br />
            <span className="text-pink-500">CHOMMIE</span>
          </h1>
          <p className="text-gray-400 text-sm">Your smart job search assistant</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-gray-900 border border-cyan-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-900 border border-cyan-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-cyan-400 text-sm hover:text-cyan-300"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold py-3 rounded-lg hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Register' : 'Login')}
          </button>

          {/* Toggle Auth Mode */}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full border border-pink-500 text-pink-500 font-bold py-3 rounded-lg hover:bg-pink-500 hover:text-black transition-all duration-300"
          >
            {isSignUp ? 'Already have an account? Login' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          Proudly South African 🇿🇦
        </p>
      </div>
    </div>
  );
};

export default Login;
