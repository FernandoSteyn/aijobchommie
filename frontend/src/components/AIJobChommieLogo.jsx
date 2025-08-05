import React from 'react';
import { motion } from 'framer-motion';

const AIJobChommieLogo = ({ 
  size = 96, 
  variant = 'default', 
  animated = true, 
  className = '',
  style = {} 
}) => {
  const logoVariants = {
    default: '/logos/logo-96.png',
    small: '/logos/logo-72.png',
    large: '/logos/logo-192.png',
    xlarge: '/logos/logo-512.png'
  };

  const animationProps = animated ? {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    whileHover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { type: "spring", stiffness: 300 }
    },
    whileTap: { scale: 0.95 },
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20 
    }
  } : {};

  const logoSrc = logoVariants[variant] || logoVariants.default;

  const logoStyle = {
    width: size,
    height: size,
    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
    ...style
  };

  if (animated) {
    return (
      <motion.div 
        className={`inline-block ${className}`}
        {...animationProps}
      >
        <img 
          src={logoSrc}
          alt="AI Job Chommie - Intelligent Job Search Assistant"
          style={logoStyle}
          className="select-none"
          draggable={false}
        />
      </motion.div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <img 
        src={logoSrc}
        alt="AI Job Chommie - Intelligent Job Search Assistant"
        style={logoStyle}
        className="select-none"
        draggable={false}
      />
    </div>
  );
};

export default AIJobChommieLogo;
