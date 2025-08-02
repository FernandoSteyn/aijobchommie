import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    // Simulate sending reset email
    toast.success('Password reset email sent! Please check your inbox.');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form className="card-3d space-y-6">
          <h2 className="text-center mb-8">Forgot Password</h2>
          <motion.div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-neon"
              required
            />
          </motion.div>
          <motion.button
            type="button"
            onClick={handleForgotPassword}
            className="btn btn-neon-primary w-full"
          >
            Send Reset Email
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

