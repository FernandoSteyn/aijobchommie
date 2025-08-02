import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaBriefcase, FaChartLine, FaPiggyBank } from 'react-icons/fa';

const AboutPage = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Users', color: 'var(--neon-cyan)' },
    { icon: FaBriefcase, value: '500+', label: 'Jobs/Day', color: 'var(--neon-pink)' },
    { icon: FaChartLine, value: '95%', label: 'Accuracy', color: 'var(--neon-green)' },
    { icon: FaPiggyBank, value: '90%', label: 'Savings', color: 'var(--neon-yellow)' }
  ];

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">About AI Job Chommie</h1>
        <div className="w-8" />
      </motion.div>

      {/* 3D Animated Logo */}
      <motion.div
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="flex justify-center mb-8"
      >
        <div className="loading-brain w-32 h-32">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="about-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--neon-cyan)">
                  <animate attributeName="stop-color" 
                    values="var(--neon-cyan);var(--neon-pink);var(--neon-green);var(--neon-cyan)" 
                    dur="5s" 
                    repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="var(--neon-pink)">
                  <animate attributeName="stop-color" 
                    values="var(--neon-pink);var(--neon-green);var(--neon-cyan);var(--neon-pink)" 
                    dur="5s" 
                    repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <path
              fill="url(#about-gradient)"
              d="M100,30 C120,30 140,40 150,60 C160,80 150,100 140,110 C150,120 160,140 150,160 C140,180 120,190 100,190 C80,190 60,180 50,160 C40,140 50,120 60,110 C50,100 40,80 50,60 C60,40 80,30 100,30 Z"
              transform="scale(1.2) translate(-20, -20)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d mb-8"
      >
        <h2 className="text-2xl text-neon-cyan mb-4">Our Story</h2>
        <p className="text-gray-300 leading-relaxed">
          Born from the heart of Port Elizabeth, AI Job Chommie was created to help South Africans 
          find meaningful employment using cutting-edge AI technology while keeping costs minimal. 
          We understand the struggle of job hunting, especially when you're facing challenges, 
          and we're here to make it easier.
        </p>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl text-neon-pink mb-4">Our Mission</h2>
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-xl italic text-white px-4"
          style={{ textShadow: '0 0 20px var(--neon-pink)' }}
        >
          "To democratize job searching through affordable AI technology, 
          helping every South African find their perfect job match."
        </motion.p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <h2 className="text-2xl text-neon-green text-center mb-6">The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, rotateY: 180 }}
              className="card-3d text-center py-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex justify-center mb-3"
              >
                <stat.icon size={40} style={{ color: stat.color }} />
              </motion.div>
              <motion.h3
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                className="text-3xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Meet the Founder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: "spring" }}
        className="card-3d"
      >
        <h2 className="text-2xl text-neon-yellow mb-4">Meet the Founder</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center text-black font-bold text-2xl"
            style={{ boxShadow: '0 0 30px var(--neon-cyan)' }}
          >
            FS
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neon-cyan mb-2">Fernando Steyn</h3>
            <p className="text-gray-300 italic">
              "As a welder who faced unemployment, I understand the struggle. 
              This app is my way of giving back to the community, helping others 
              find opportunities even in the toughest times. Together, we can 
              overcome any challenge, chommie!"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/jobs')}
          className="btn btn-neon-primary"
        >
          Start Your Journey Today
        </motion.button>
      </motion.div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <motion.path
            d="M0,100 L200,100 L200,300 L400,300"
            stroke="var(--neon-cyan)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M100,0 L100,200 L300,200 L300,400"
            stroke="var(--neon-pink)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1, repeat: Infinity }}
          />
        </svg>
      </div>
    </div>
  );
};

export default AboutPage;
