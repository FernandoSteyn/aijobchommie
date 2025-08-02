import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaEdit, FaStar, FaDownload, FaSync, FaPlus } from 'react-icons/fa';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Fernando Steyn',
    title: 'Welder',
    location: 'Port Elizabeth',
    profileStrength: 4.8,
    about: 'Experienced welder with 10+ years in heavy industry and fabrication. Specialized in MIG, TIG, and arc welding. Safety-conscious professional with a strong work ethic.',
    skills: ['Welding', 'Fabrication', 'Safety', 'Team Work', 'Problem Solving', 'Blueprint Reading'],
    experience: [
      {
        title: 'Senior Welder',
        company: 'Previous Company',
        period: '2018 - 2024',
        description: 'Led welding operations for major construction projects'
      }
    ]
  });

  const skillColors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-orange)'];

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Profile</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/profile/edit')}
          className="text-neon-pink"
        >
          <FaEdit size={24} />
        </motion.button>
      </motion.div>

      {/* Profile Photo Section */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="w-32 h-32 rounded-full border-4 border-neon-cyan overflow-hidden"
            style={{
              boxShadow: '0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan)'
            }}
          >
            {/* 3D Avatar Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center">
              <span className="text-4xl font-bold text-black">FS</span>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 p-3 bg-neon-pink rounded-full text-black"
          >
            <FaCamera />
          </motion.button>
        </div>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl mb-2">{user.name}</h2>
        <p className="text-neon-cyan text-lg mb-2">{user.title} • {user.location}</p>
        <div className="flex items-center justify-center gap-1">
          <FaStar className="text-neon-yellow" />
          <span className="text-neon-yellow font-bold">{user.profileStrength}</span>
          <span className="text-gray-400">Profile Strength</span>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d mb-6"
      >
        <h3 className="text-xl text-neon-cyan mb-4">About Me</h3>
        <p className="text-gray-300 leading-relaxed">{user.about}</p>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="card-3d mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-neon-pink">Skills</h3>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-neon-green"
          >
            <FaPlus />
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="px-4 py-2 rounded-full border-2"
              style={{
                borderColor: skillColors[index % skillColors.length],
                color: skillColors[index % skillColors.length],
                boxShadow: `0 0 20px ${skillColors[index % skillColors.length]}`
              }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d mb-6"
      >
        <h3 className="text-xl text-neon-green mb-4">Experience</h3>
        {user.experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="mb-4 pb-4 border-b border-gray-700 last:border-0"
          >
            <h4 className="text-lg font-semibold text-neon-cyan">{exp.title}</h4>
            <p className="text-gray-400">{exp.company}</p>
            <p className="text-sm text-gray-500">{exp.period}</p>
            <p className="text-gray-300 mt-2">{exp.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-neon-primary flex-1 flex items-center justify-center gap-2"
        >
          <FaDownload /> Download CV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-neon-secondary flex-1 flex items-center justify-center gap-2"
        >
          <FaSync /> Update CV
        </motion.button>
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: skillColors[i % skillColors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${skillColors[i % skillColors.length]}`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
