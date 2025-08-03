import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-cyber text-white flex flex-col items-center justify-center px-4">
      <motion.h1 
        className="text-5xl font-bold text-center neon-glow mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        AI Job Chommie
      </motion.h1>
      <motion.p 
        className="text-2xl text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Your AI companion for seamless job matching and career advancement.
      </motion.p>
      <motion.img 
        src="/path-to-placeholder-image.jpg" 
        alt="App Screenshot" 
        className="w-full max-w-lg shadow-neon mb-12 rounded cursor-pointer"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      />
      <div className="mb-12">
        <motion.button 
          className="btn btn-neon-primary mx-2"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Install App
        </motion.button>
        <Link to="/privacy" className="btn btn-neon-secondary mx-2">
          Privacy Policy
        </Link>
        <Link to="/terms" className="btn btn-neon-secondary mx-2">
          Terms of Service
        </Link>
      </div>
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="italic text-gray-300 mb-4"
        >
          "Installing AI Job Chommie will transform your career journey. Embrace the future with confidence!"
        </p>
        <p className="text-lg">
          Join thousands of satisfied users riding the wave of AI-powered job solutions.
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;

