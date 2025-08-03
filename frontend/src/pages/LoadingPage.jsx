import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingPage = ({ loadingText = "Finding your perfect match..." }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      {/* 3D Rotating AI Brain Logo */}
      <div className="loading-brain">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="brain-gradient-loading" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)">
                <animate attributeName="stop-color" 
                  values="var(--neon-cyan);var(--neon-pink);var(--neon-cyan)" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="var(--neon-pink)">
                <animate attributeName="stop-color" 
                  values="var(--neon-pink);var(--neon-green);var(--neon-pink)" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="var(--neon-green)">
                <animate attributeName="stop-color" 
                  values="var(--neon-green);var(--neon-cyan);var(--neon-green)" 
                  dur="3s" 
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          {/* Brain shape */}
          <g filter="url(#glow)">
            <path
              fill="url(#brain-gradient-loading)"
              d="M100,20 C130,20 160,30 170,60 C180,90 170,120 160,130 C170,140 180,170 170,200 C160,230 130,240 100,240 C70,240 40,230 30,200 C20,170 30,140 40,130 C30,120 20,90 30,60 C40,30 70,20 100,20 Z"
              transform="scale(0.8) translate(25, 25)"
            />
            
            {/* Neural pathways */}
            <path
              stroke="var(--neon-cyan)"
              strokeWidth="2"
              fill="none"
              d="M80,80 Q100,100 120,80 T140,100 T120,120 T100,100 T80,80"
              opacity="0.6"
            >
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </path>
            
            {/* Synapses */}
            {[
              { cx: 80, cy: 80 },
              { cx: 120, cy: 80 },
              { cx: 100, cy: 100 },
              { cx: 80, cy: 120 },
              { cx: 120, cy: 120 }
            ].map((pos, i) => (
              <circle key={i} cx={pos.cx} cy={pos.cy} r="4" fill="var(--neon-cyan)">
                <animate 
                  attributeName="r" 
                  values="4;8;4" 
                  dur="1.5s" 
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite" 
                />
                <animate 
                  attributeName="opacity" 
                  values="0.8;1;0.8" 
                  dur="1.5s" 
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite" 
                />
              </circle>
            ))}
          </g>
        </svg>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="loading-text"
      >
        JOIN THE REVOLUTION
      </motion.h2>

      {/* Progress Bar */}
      <div className="w-80 mt-8 mb-6">
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-neon-cyan font-mono">
          {progress}%
        </div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg text-white mb-6"
      >
        {loadingText}
      </motion.p>

      {/* Animated Loading Dots */}
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>

      {/* Tech-style Loading Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-neon-green font-mono"
      >
        <motion.div
          key={progress}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          {progress < 20 && "» Initializing AI neural networks..."}
          {progress >= 20 && progress < 40 && "» Analyzing job market data..."}
          {progress >= 40 && progress < 60 && "» Scanning CV patterns..."}
          {progress >= 60 && progress < 80 && "» Matching skills to opportunities..."}
          {progress >= 80 && progress < 100 && "» Finalizing recommendations..."}
          {progress >= 100 && "» Complete! Redirecting..."}
        </motion.div>
      </motion.div>

      {/* Background Matrix Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-neon-green font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
            animate={{
              y: [0, window.innerHeight + 20]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
