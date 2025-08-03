import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaRocket, FaChartLine, FaBrain } from 'react-icons/fa';
import AILogo from '../components/AILogo';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const floatingIcons = [
    { Icon: FaBriefcase, delay: 0 },
    { Icon: FaRocket, delay: 0.2 },
    { Icon: FaChartLine, delay: 0.4 },
    { Icon: FaBrain, delay: 0.6 }
  ];

  return (
    <div className="loading-container">
      {/* AI Logo */}
      <AILogo size="xl" className="mb-8" />
      {/* 3D Rotating Logo */}
      <motion.div
        initial={{ rotateY: 0, scale: 0 }}
        animate={{ rotateY: isLoaded ? 360 : 0, scale: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="loading-brain"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)" />
              <stop offset="50%" stopColor="var(--neon-pink)" />
              <stop offset="100%" stopColor="var(--neon-green)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#brain-gradient)"
            d="M100,30 C120,30 140,40 150,60 C160,80 150,100 140,110 C150,120 160,140 150,160 C140,180 120,190 100,190 C80,190 60,180 50,160 C40,140 50,120 60,110 C50,100 40,80 50,60 C60,40 80,30 100,30 Z"
            transform="translate(0,0)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
          {/* Neural connections */}
          <circle cx="80" cy="80" r="5" fill="var(--neon-cyan)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="80" r="5" fill="var(--neon-pink)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="120" r="5" fill="var(--neon-green)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="glitch"
        data-text="AI JOB CHOMMIE"
      >
        AI JOB CHOMMIE
      </motion.h1>

      {/* Revolution Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-2xl text-neon-pink font-bold mb-2"
        style={{ textShadow: '0 0 15px currentColor' }}
      >
        JOIN THE REVOLUTION
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-xl text-neon-cyan mt-2 mb-8"
        style={{ textShadow: '0 0 10px currentColor' }}
      >
        Your Smart Job Search Buddy
      </motion.p>

      {/* Get Started Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/login')}
        className="btn btn-neon-primary mb-12"
      >
        GET STARTED
      </motion.button>

      {/* Floating 3D Icons */}
      <div className="flex gap-8 mb-12">
        {floatingIcons.map(({ Icon, delay }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + delay, duration: 0.6 }}
            className="floating"
            style={{ animationDelay: `${delay}s` }}
          >
            <div className="card-3d p-4">
              <Icon size={40} className="text-neon-cyan" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="text-center max-w-lg"
      >
        <ul className="space-y-3">
          <motion.li
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="text-lg text-white flex items-center justify-center gap-2"
          >
            <span className="text-neon-green">•</span> AI-Powered Job Matching
          </motion.li>
          <motion.li
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="text-lg text-white flex items-center justify-center gap-2"
          >
            <span className="text-neon-pink">•</span> Smart CV Analysis
          </motion.li>
          <motion.li
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="text-lg text-white flex items-center justify-center gap-2"
          >
            <span className="text-neon-cyan">•</span> Automated Applications
          </motion.li>
        </ul>
      </motion.div>

      {/* Background Particles Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px var(--neon-cyan)'
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
