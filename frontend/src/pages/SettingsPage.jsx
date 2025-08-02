import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaShieldAlt, FaMapMarkerAlt, 
  FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaBell, 
  FaMobileAlt, FaRobot, FaBrain, FaChevronRight 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    smsNotifications: false,
    emailUpdates: true
  });
  const [aiSettings, setAiSettings] = useState({
    autoApply: false,
    matchSensitivity: 80,
    aiAssistant: true
  });

  const settingSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: FaUser, label: 'Profile Information', path: '/settings/profile' },
        { icon: FaEnvelope, label: 'Email & Password', path: '/settings/email' },
        { icon: FaShieldAlt, label: 'Privacy & Security', path: '/settings/privacy' }
      ]
    },
    {
      title: 'Job Preferences',
      items: [
        { icon: FaMapMarkerAlt, label: 'Location Preferences', path: '/settings/location' },
        { icon: FaMoneyBillWave, label: 'Salary Range', path: '/settings/salary' },
        { icon: FaBuilding, label: 'Industry Preferences', path: '/settings/industry' },
        { icon: FaCalendarAlt, label: 'Availability', path: '/settings/availability' }
      ]
    }
  ];

  const handleToggle = (section, key) => {
    if (section === 'notifications') {
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      toast.success(`${key} ${!notifications[key] ? 'enabled' : 'disabled'}`);
    } else if (section === 'ai' && key !== 'matchSensitivity') {
      setAiSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      toast.success(`${key} ${!aiSettings[key] ? 'enabled' : 'disabled'}`);
    }
  };

  const handleSliderChange = (value) => {
    setAiSettings(prev => ({
      ...prev,
      matchSensitivity: value
    }));
  };

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Settings</h1>
        <div className="w-8" />
      </motion.div>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: sectionIndex * 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg text-neon-cyan mb-4">{section.title}</h2>
          <div className="card-3d p-2">
            {section.items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: sectionIndex * 0.2 + index * 0.1 }}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className="text-neon-pink" />
                  <span className="text-white">{item.label}</span>
                </div>
                <FaChevronRight className="text-gray-400" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-lg text-neon-pink mb-4">Notifications</h2>
        <div className="card-3d p-4 space-y-4">
          {[
            { key: 'jobAlerts', icon: FaBell, label: 'Job Alerts' },
            { key: 'smsNotifications', icon: FaMobileAlt, label: 'SMS Notifications' },
            { key: 'emailUpdates', icon: FaEnvelope, label: 'Email Updates' }
          ].map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="text-neon-green" />
                <span className="text-white">{item.label}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleToggle('notifications', item.key)}
                className={`relative w-14 h-7 rounded-full transition-all ${
                  notifications[item.key] ? 'bg-neon-cyan' : 'bg-gray-600'
                }`}
                style={{
                  boxShadow: notifications[item.key] ? '0 0 20px var(--neon-cyan)' : 'none'
                }}
              >
                <motion.div
                  animate={{ x: notifications[item.key] ? 28 : 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full"
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-lg text-neon-green mb-4">AI Settings</h2>
        <div className="card-3d p-4 space-y-6">
          {/* Auto Apply Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <FaRobot size={20} className="text-neon-cyan" />
              <span className="text-white">Auto-Apply</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle('ai', 'autoApply')}
              className={`relative w-14 h-7 rounded-full transition-all ${
                aiSettings.autoApply ? 'bg-neon-pink' : 'bg-gray-600'
              }`}
              style={{
                boxShadow: aiSettings.autoApply ? '0 0 20px var(--neon-pink)' : 'none'
              }}
            >
              <motion.div
                animate={{ x: aiSettings.autoApply ? 28 : 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>

          {/* Match Sensitivity Slider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <FaBrain size={20} className="text-neon-purple" />
                <span className="text-white">Match Sensitivity</span>
              </div>
              <span className="text-neon-cyan font-bold">{aiSettings.matchSensitivity}%</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-700 rounded-full">
                <motion.div
                  animate={{ width: `${aiSettings.matchSensitivity}%` }}
                  className="absolute h-full bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full"
                  style={{
                    boxShadow: '0 0 20px var(--neon-cyan)'
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={aiSettings.matchSensitivity}
                onChange={(e) => handleSliderChange(e.target.value)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          </motion.div>

          {/* AI Assistant Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <FaBrain size={20} className="text-neon-yellow" />
              <span className="text-white">AI Assistant</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle('ai', 'aiAssistant')}
              className={`relative w-14 h-7 rounded-full transition-all ${
                aiSettings.aiAssistant ? 'bg-neon-green' : 'bg-gray-600'
              }`}
              style={{
                boxShadow: aiSettings.aiAssistant ? '0 0 20px var(--neon-green)' : 'none'
              }}
            >
              <motion.div
                animate={{ x: aiSettings.aiAssistant ? 28 : 2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Gears Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-neon-cyan opacity-10"
            style={{
              fontSize: `${40 + i * 20}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              direction: i % 2 === 0 ? "normal" : "reverse"
            }}
          >
            ⚙️
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
