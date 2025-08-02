import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaPaperPlane, FaCalendarCheck, FaSearch, FaFileAlt, FaRobot } from 'react-icons/fa';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    jobMatches: 25,
    applications: 8,
    interviews: 3
  });
  const [recentMatches, setRecentMatches] = useState([
    { id: 1, title: 'Senior Welder', company: 'ABC Company', match: 95 },
    { id: 2, title: 'Fabrication Specialist', company: 'XYZ Industries', match: 88 },
    { id: 3, title: 'Workshop Supervisor', company: 'DEF Ltd', match: 82 }
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const motivationalQuotes = [
    "Every master was once a disaster. Keep pushing, chommie!",
    "Your next job is just one application away!",
    "Success is not final, failure is not fatal. Keep going!",
    "Today's struggle is tomorrow's strength!"
  ];

  const todaysQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const statCards = [
    { 
      icon: FaBriefcase, 
      value: stats.jobMatches, 
      label: 'Job Matches',
      color: 'var(--neon-cyan)',
      delay: 0.2
    },
    { 
      icon: FaPaperPlane, 
      value: stats.applications, 
      label: 'Applications',
      color: 'var(--neon-pink)',
      delay: 0.4
    },
    { 
      icon: FaCalendarCheck, 
      value: stats.interviews, 
      label: 'Interviews',
      color: 'var(--neon-green)',
      delay: 0.6
    }
  ];

  const quickActions = [
    { icon: FaSearch, label: 'Find Jobs', action: () => navigate('/jobs') },
    { icon: FaFileAlt, label: 'Upload CV', action: () => navigate('/profile') },
    { icon: FaRobot, label: 'AI Match', action: () => navigate('/jobs?ai=true') }
  ];

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Welcome back, {user?.user_metadata?.full_name || 'Chommie'}! 👋</h1>
        <p className="text-gray-400 text-lg italic">"{todaysQuote}"</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map(({ icon: Icon, value, label, color, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="card-3d text-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Icon size={48} style={{ color }} className="drop-shadow-glow" />
            </motion.div>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="text-4xl font-bold mb-2"
              style={{ color }}
            >
              {value}
            </motion.h3>
            <p className="text-gray-400">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-xl mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {quickActions.map(({ icon: Icon, label, action }, index) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={action}
              className="btn btn-neon-secondary flex items-center gap-2"
            >
              <Icon /> {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Job Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-xl mb-4">Recent Job Matches</h2>
        <div className="space-y-4">
          {recentMatches.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ x: 10 }}
              className="card-3d flex items-center justify-between p-4 cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div>
                <h3 className="text-lg font-semibold text-neon-cyan">{job.title}</h3>
                <p className="text-gray-400">{job.company}</p>
              </div>
              <div className="text-right">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-bold"
                  style={{
                    color: job.match >= 90 ? 'var(--neon-green)' : 
                           job.match >= 80 ? 'var(--neon-cyan)' : 'var(--neon-yellow)',
                    textShadow: `0 0 20px ${job.match >= 90 ? 'var(--neon-green)' : 
                                           job.match >= 80 ? 'var(--neon-cyan)' : 'var(--neon-yellow)'}`
                  }}
                >
                  {job.match}%
                </motion.div>
                <p className="text-sm text-gray-400">Match</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/jobs')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-full flex items-center justify-center shadow-neon"
        style={{
          boxShadow: '0 0 30px var(--neon-cyan), 0 0 60px var(--neon-pink)'
        }}
      >
        <FaSearch size={24} className="text-black" />
      </motion.button>

      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 100px, var(--neon-cyan) 100px, var(--neon-cyan) 101px),
              repeating-linear-gradient(90deg, transparent, transparent 100px, var(--neon-cyan) 100px, var(--neon-cyan) 101px)
            `
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
