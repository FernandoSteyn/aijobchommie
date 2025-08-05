import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiBriefcase, FiUser, FiSettings, FiFileText, 
  FiLogOut, FiTrendingUp, FiBell, FiMenu, FiX,
  FiDollarSign, FiAward, FiHelpCircle 
} from 'react-icons/fi';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import AIJobChommieLogo from './AIJobChommieLogo';

const Navigation = ({ user, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully! See you soon, chommie! 👋');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const mainNavItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: FiHome,
      color: 'from-cyan-400 to-blue-500',
      notification: false
    },
    { 
      path: '/jobs', 
      label: 'Jobs', 
      icon: FiBriefcase,
      color: 'from-purple-400 to-pink-500',
      notification: true,
      badge: '25+'
    },
    { 
      path: '/applications', 
      label: 'Applications', 
      icon: FiFileText,
      color: 'from-green-400 to-emerald-500',
      notification: notificationCount > 0,
      badge: notificationCount
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: FiUser,
      color: 'from-orange-400 to-red-500',
      notification: false
    },
  ];

  const secondaryNavItems = [
    { path: '/pricing', label: 'Pricing', icon: FiDollarSign },
    { path: '/subscription', label: 'Subscription', icon: FiAward },
    { path: '/settings', label: 'Settings', icon: FiSettings },
    { path: '/help', label: 'Help', icon: FiHelpCircle },
  ];

  const adminNavItems = isAdmin ? [
    { path: '/manager', label: 'Manager Dashboard', icon: FiTrendingUp },
  ] : [];

  // Desktop Navigation
  const DesktopNav = () => (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-50"
    >
      <motion.div 
        animate={{ width: isExpanded ? '280px' : '80px' }}
        className="bg-black/90 backdrop-blur-xl border border-gray-800 rounded-r-2xl shadow-2xl overflow-hidden"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <AIJobChommieLogo 
              size={48} 
              variant="small" 
              animated={true}
              className="cursor-pointer"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))'
              }}
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="ml-3 font-bold text-xl bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
                >
                  AI Job Chommie
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2">
            {[...mainNavItems, ...adminNavItems].map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center p-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r ' + (item.color || 'from-cyan-400 to-blue-500') + ' shadow-lg' 
                    : 'hover:bg-gray-800/50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <item.icon 
                        size={24} 
                        className={isActive ? 'text-black' : 'text-gray-400'} 
                      />
                      {item.notification && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                        />
                      )}
                    </motion.div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-4 flex items-center justify-between flex-1"
                        >
                          <span className={`font-semibold ${
                            isActive ? 'text-black' : 'text-gray-300'
                          }`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-800" />

          {/* Secondary Navigation */}
          <div className="space-y-2">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      size={20} 
                      className={isActive ? 'text-cyan-400' : 'text-gray-500'} 
                    />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className={`ml-4 text-sm ${
                            isActive ? 'text-cyan-400' : 'text-gray-400'
                          }`}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Logout Button */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="mt-8 w-full flex items-center p-3 rounded-xl hover:bg-red-500/20 transition-all duration-300"
            >
              <FiLogOut size={20} className="text-red-400" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-4 text-sm text-red-400 font-semibold"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-black/95 backdrop-blur-xl border-t border-gray-800">
          <div className="flex justify-around items-center py-2">
            {mainNavItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative flex flex-col items-center px-3 py-2 transition-all
                `}
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <div className={`p-2 rounded-xl ${
                        isActive ? 'bg-gradient-to-r ' + item.color : ''
                      }`}>
                        <item.icon 
                          size={20} 
                          className={isActive ? 'text-black' : 'text-gray-400'}
                        />
                      </div>
                      {item.notification && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                        />
                      )}
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? 'text-transparent bg-gradient-to-r ' + item.color + ' bg-clip-text' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
            
            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(true)}
              className="flex flex-col items-center px-3 py-2"
            >
              <div className="p-2 rounded-xl">
                <FiMenu size={20} className="text-gray-400" />
              </div>
              <span className="text-xs mt-1 text-gray-400 font-medium">Menu</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2"
                  >
                    <FiX size={24} className="text-gray-400" />
                  </motion.button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="mb-8 p-4 bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <p className="text-lg font-semibold text-white">{user.email}</p>
                  </div>
                )}

                {/* All Navigation Items */}
                <div className="space-y-2">
                  {[...mainNavItems, ...adminNavItems, ...secondaryNavItems].map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={({ isActive }) => `
                          flex items-center p-4 rounded-xl transition-all
                          ${isActive 
                            ? 'bg-gradient-to-r ' + (item.color || 'from-gray-700 to-gray-600') + ' shadow-lg'
                            : 'hover:bg-gray-800'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon 
                              size={24} 
                              className={isActive ? 'text-black' : 'text-gray-400'}
                            />
                            <span className={`ml-4 font-semibold ${
                              isActive ? 'text-black' : 'text-gray-300'
                            }`}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Logout Button */}
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="mt-8 w-full flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg"
                  >
                    <FiLogOut size={20} className="text-white" />
                    <span className="ml-3 text-white font-semibold">Logout</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

export default Navigation;

