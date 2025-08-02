import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-6xl text-neon-pink mb-4">404</h1>
        <h2 className="text-2xl text-neon-cyan mb-4">Page Not Found</h2>
        <p className="text-gray-300 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate('/')} className="btn btn-neon-secondary">
          Go Back Home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

