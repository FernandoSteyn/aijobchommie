import React from 'react';
import { motion } from 'framer-motion';

const AILogo = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* AI Brain-Face SVG Logo */}
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#0080ff" />
            <stop offset="100%" stopColor="#8000ff" />
          </linearGradient>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
        </defs>
        
        {/* Face/Head outline */}
        <path 
          d="M100 20 C140 20 170 50 170 90 C170 130 150 160 120 170 C110 175 90 175 80 170 C50 160 30 130 30 90 C30 50 60 20 100 20 Z" 
          fill="url(#faceGradient)" 
          stroke="#00ffff" 
          strokeWidth="2"
        />
        
        {/* Brain pattern (left side) */}
        <path 
          d="M50 70 Q60 60 70 65 Q80 70 85 80 Q80 90 70 95 Q60 100 50 90 Q45 80 50 70 Z" 
          fill="url(#brainGradient)" 
          opacity="0.8"
        />
        <path 
          d="M65 85 Q75 80 85 85 Q90 95 80 100 Q70 105 65 95 Q60 85 65 85 Z" 
          fill="url(#brainGradient)" 
          opacity="0.6"
        />
        <path 
          d="M55 100 Q65 95 75 100 Q80 110 70 115 Q60 120 55 110 Q50 100 55 100 Z" 
          fill="url(#brainGradient)" 
          opacity="0.7"
        />
        
        {/* Circuit lines */}
        <path d="M45 75 L55 75 L60 80 L70 80" stroke="#00ffff" strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M50 90 L65 90 L70 95 L85 95" stroke="#0080ff" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M60 105 L75 105 L80 110" stroke="#8000ff" strokeWidth="1" fill="none" opacity="0.7" />
        
        {/* Face features */}
        {/* Eyes */}
        <circle cx="110" cy="80" r="8" fill="#00ffff" opacity="0.8" />
        <circle cx="130" cy="85" r="6" fill="#0080ff" opacity="0.6" />
        
        {/* Nose/mouth area */}
        <path d="M115 100 Q120 105 125 100" stroke="#00ffff" strokeWidth="2" fill="none" opacity="0.7" />
        
        {/* Jaw line */}
        <path d="M90 140 Q100 150 120 145 Q140 140 150 135" stroke="#c0c0c0" strokeWidth="1" fill="none" opacity="0.8" />
        
        {/* Glowing effect */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.2" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.1" />
      </svg>
      
      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AILogo;
