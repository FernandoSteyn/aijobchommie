import React, { useState, useEffect } from 'react';
import { FiX, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MarketingBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerType, setBannerType] = useState('welcome');
  const navigate = useNavigate();

  // Psychological triggers for engagement
  const bannerMessages = {
    welcome: {
      title: "🎉 Welcome to AI Job Chommie!",
      message: "Join 10,000+ South Africans who found their dream jobs",
      cta: "Start Free Trial",
      color: "from-cyan-400 to-blue-500"
    },
    urgency: {
      title: "⏰ Limited Time Offer!",
      message: "Get 50% off Premium for the next 24 hours",
      cta: "Claim Offer Now",
      color: "from-pink-500 to-red-500"
    },
    social: {
      title: "🔥 Trending Now",
      message: "237 new jobs posted today in Johannesburg",
      cta: "View Jobs",
      color: "from-green-400 to-emerald-500"
    },
    success: {
      title: "✨ Success Story",
      message: "Thabo got 5 interviews this week using AI Job Chommie",
      cta: "Be Like Thabo",
      color: "from-purple-400 to-indigo-500"
    },
    fear: {
      title: "⚠️ Don't Miss Out",
      message: "93% of good jobs are filled within 48 hours",
      cta: "Apply Now",
      color: "from-yellow-400 to-orange-500"
    }
  };

  useEffect(() => {
    // Show banner after 3 seconds on first visit
    const hasVisited = localStorage.getItem('ajc_visited');
    if (!hasVisited) {
      setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('ajc_visited', 'true');
      }, 3000);
    }

    // Rotate banner messages every 30 seconds
    const interval = setInterval(() => {
      const types = Object.keys(bannerMessages);
      const randomType = types[Math.floor(Math.random() * types.length)];
      setBannerType(randomType);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Show again after 5 minutes
    setTimeout(() => setIsVisible(true), 300000);
  };

  const handleCTA = () => {
    navigate('/register');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentBanner = bannerMessages[bannerType];

  return (
    <>
      {/* Mobile Bottom Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-lg border-t border-gray-800 lg:hidden animate-slideUp">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700"
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">
              {currentBanner.title}
            </h3>
            <p className="text-sm text-gray-300">
              {currentBanner.message}
            </p>
            <button
              onClick={handleCTA}
              className={`w-full py-3 rounded-lg font-bold bg-gradient-to-r ${currentBanner.color} text-black transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              {currentBanner.cta}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center">
              <FiUsers className="w-3 h-3 mr-1" />
              10k+ Users
            </span>
            <span className="flex items-center">
              <FiAward className="w-3 h-3 mr-1" />
              4.8★ Rating
            </span>
            <span className="flex items-center">
              <FiTrendingUp className="w-3 h-3 mr-1" />
              85% Success
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Side Banner */}
      <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-50 animate-slideLeft">
        <div className="bg-black/95 backdrop-blur-lg border border-gray-800 rounded-lg p-6 w-80 shadow-2xl">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              {currentBanner.title}
            </h3>
            <p className="text-gray-300">
              {currentBanner.message}
            </p>
            
            <button
              onClick={handleCTA}
              className={`w-full py-3 rounded-lg font-bold bg-gradient-to-r ${currentBanner.color} text-black transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              {currentBanner.cta}
            </button>

            {/* Trust Indicators */}
            <div className="space-y-2 pt-4 border-t border-gray-800">
              <div className="flex items-center text-sm text-gray-400">
                <FiUsers className="w-4 h-4 mr-2" />
                <span>Join 10,000+ job seekers</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiAward className="w-4 h-4 mr-2" />
                <span>Trusted by top SA companies</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                <span>85% get interviews faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleCTA}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-full p-4 shadow-lg lg:hidden animate-bounce"
      >
        <span className="text-2xl">💼</span>
      </button>
    </>
  );
};

export default MarketingBanner;
