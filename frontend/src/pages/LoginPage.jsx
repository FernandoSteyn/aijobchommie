import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back, chommie! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
      });

      if (error) throw error;
    } catch (error) {
      toast.error(`${provider} login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 3D AI Logo */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="flex justify-center mb-8"
        >
          <div className="loading-brain w-24 h-24">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="login-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--neon-cyan)" />
                  <stop offset="100%" stopColor="var(--neon-pink)" />
                </linearGradient>
              </defs>
              <path
                fill="url(#login-gradient)"
                d="M100,30 C120,30 140,40 150,60 C160,80 150,100 140,110 C150,120 160,140 150,160 C140,180 120,190 100,190 C80,190 60,180 50,160 C40,140 50,120 60,110 C50,100 40,80 50,60 C60,40 80,30 100,30 Z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d"
        >
          <h2 className="text-center mb-8">
            WELCOME BACK, CHOMMIE
          </h2>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-neon pl-12"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-pink" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-neon pl-12"
                required
              />
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-neon-cyan bg-transparent border-2 border-neon-cyan rounded focus:ring-neon-cyan"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-neon-cyan hover:text-neon-pink transition-colors"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={loading}
              className="btn btn-neon-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loading-dot w-2 h-2 mr-2"></span>
                  <span className="loading-dot w-2 h-2 mr-2" style={{ animationDelay: '0.2s' }}></span>
                  <span className="loading-dot w-2 h-2" style={{ animationDelay: '0.4s' }}></span>
                </span>
              ) : (
                'SIGN IN'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative my-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-400">OR CONTINUE WITH</span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-4"
          >
            {[
              { Icon: FaGoogle, color: 'hover:text-red-500', provider: 'Google' },
              { Icon: FaFacebook, color: 'hover:text-blue-500', provider: 'Facebook' },
              { Icon: FaLinkedin, color: 'hover:text-blue-400', provider: 'LinkedIn' }
            ].map(({ Icon, color, provider }) => (
              <motion.button
                key={provider}
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSocialLogin(provider)}
                className={`p-3 border-2 border-gray-600 rounded-full transition-all ${color} hover:border-current`}
              >
                <Icon size={24} />
              </motion.button>
            ))}
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-8 text-gray-400"
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-neon-cyan hover:text-neon-pink transition-colors font-semibold"
            >
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 20px var(--neon-cyan)'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
