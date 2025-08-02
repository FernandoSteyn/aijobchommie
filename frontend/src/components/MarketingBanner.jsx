import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiTrendingUp, FiUsers, FiAward, FiZap, FiShield, 
  FiTarget, FiDollarSign, FiClock, FiCheckCircle,
  FiArrowRight, FiStar, FiBell, FiGift
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const MarketingBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerType, setBannerType] = useState('welcome');
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [liveUsers, setLiveUsers] = useState(247);
  const [jobsAdded, setJobsAdded] = useState(156);
  const navigate = useNavigate();
  const location = useLocation();

  // Ultra-premium banner configurations with psychological triggers
  const bannerMessages = {
    welcome: {
      title: "Transform Your Career with AI",
      subtitle: "Join the Revolution",
      message: "10,847 South Africans landed their dream jobs this month",
      features: ["AI-Powered Matching", "Auto-Apply System", "Interview Prep"],
      cta: "Start Your Journey",
      secondaryCta: "Watch Success Stories",
      color: "from-cyan-400 via-blue-500 to-purple-500",
      icon: FiZap,
      stats: { users: "10K+", success: "92%", jobs: "50K+" },
      urgency: "Limited spots available"
    },
    urgency: {
      title: "Black Friday Special - 70% OFF",
      subtitle: "Ends Tonight",
      message: "Premium lifetime access for the price of 3 months",
      features: ["Unlimited Applications", "Priority Support", "AI Cover Letters"],
      cta: "Claim Your Discount",
      secondaryCta: "Why Premium?",
      color: "from-red-500 via-pink-500 to-purple-500",
      icon: FiGift,
      originalPrice: "R499",
      discountPrice: "R149",
      savings: "Save R350",
      urgency: "Only 47 spots left"
    },
    social: {
      title: "🔥 Jobs Alert: Your Industry is Hiring",
      subtitle: "Real-time Updates",
      message: `${jobsAdded} new jobs matching your profile added today`,
      features: ["Instant Notifications", "First to Apply", "Higher Success Rate"],
      cta: "View Matching Jobs",
      secondaryCta: "Set Alerts",
      color: "from-green-400 via-emerald-500 to-teal-500",
      icon: FiBell,
      liveIndicator: true,
      urgency: `${liveUsers} people viewing now`
    },
    success: {
      title: "Success Guaranteed or Money Back",
      subtitle: "Our Promise to You",
      message: "92% of premium users get interviews within 2 weeks",
      features: ["Personal AI Coach", "CV Optimization", "Interview Guarantee"],
      testimonial: {
        name: "Thabo Mensah",
        role: "Senior Developer at Takealot",
        message: "Got 5 interviews in my first week!"
      },
      cta: "Get Premium Access",
      secondaryCta: "Read Reviews",
      color: "from-purple-500 via-indigo-500 to-blue-500",
      icon: FiAward,
      trustBadges: ["Money Back Guarantee", "SSL Secured", "24/7 Support"],
      urgency: "Join 10,000+ successful job seekers"
    },
    exclusive: {
      title: "VIP Early Access: New AI Features",
      subtitle: "Be First to Experience",
      message: "Revolutionary job matching technology launching next week",
      features: ["GPT-4 Integration", "Video Applications", "Salary Negotiator"],
      cta: "Reserve Your Spot",
      secondaryCta: "Learn More",
      color: "from-gold-400 via-yellow-500 to-orange-500",
      icon: FiStar,
      exclusivity: "Invite-only beta",
      urgency: "Only for first 100 users"
    }
  };

  useEffect(() => {
    // Smart visibility logic based on user behavior
    const hasSeenBanner = sessionStorage.getItem('ajc_banner_seen');
    const lastVisit = localStorage.getItem('ajc_last_visit');
    const currentTime = new Date().getTime();
    
    // Show banner based on intelligent triggers
    if (!hasSeenBanner || (lastVisit && currentTime - parseInt(lastVisit) > 86400000)) {
      setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('ajc_banner_seen', 'true');
      }, location.pathname === '/jobs' ? 1500 : 3000);
    }
    
    localStorage.setItem('ajc_last_visit', currentTime.toString());

    // Dynamic banner rotation based on user location
    const rotationInterval = setInterval(() => {
      const pageSpecificBanners = {
        '/jobs': ['social', 'urgency'],
        '/pricing': ['urgency', 'success'],
        '/home': ['welcome', 'exclusive'],
        default: Object.keys(bannerMessages)
      };
      
      const availableTypes = pageSpecificBanners[location.pathname] || pageSpecificBanners.default;
      const nextType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      setBannerType(nextType);
    }, 45000);

    // Countdown timer for urgency
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    // Simulate live user activity
    const liveInterval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      setJobsAdded(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(countdownInterval);
      clearInterval(liveInterval);
    };
  }, [location.pathname]);

  const handleClose = () => {
    setIsVisible(false);
    // Intelligent re-show logic
    setTimeout(() => {
      const types = ['urgency', 'exclusive'];
      setBannerType(types[Math.floor(Math.random() * types.length)]);
      setIsVisible(true);
    }, 180000); // 3 minutes
  };

  const handleCTA = () => {
    // Track conversion
    const conversionData = {
      banner: bannerType,
      timestamp: new Date().toISOString(),
      page: location.pathname
    };
    localStorage.setItem('ajc_conversion', JSON.stringify(conversionData));
    
    // Navigate based on banner type
    const destinations = {
      welcome: '/register',
      urgency: '/pricing',
      social: '/jobs',
      success: '/pricing',
      exclusive: '/register'
    };
    
    navigate(destinations[bannerType] || '/register');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentBanner = bannerMessages[bannerType];

  // Premium Desktop Banner Component
  const PremiumDesktopBanner = () => (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-50 max-w-md"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.color} blur-3xl opacity-20 scale-110`} />
          
          <div className="relative bg-black/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Premium header with gradient */}
            <div className={`bg-gradient-to-r ${currentBanner.color} p-6 relative overflow-hidden`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  animation: 'slide 20s linear infinite'
                }} />
              </div>
              
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-black/20 backdrop-blur rounded-full p-2 hover:bg-black/40 transition-colors"
              >
                <FiX className="w-4 h-4 text-white" />
              </button>
              
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-3"
                >
                  <currentBanner.icon className="w-10 h-10 text-white/90" />
                </motion.div>
                
                {currentBanner.subtitle && (
                  <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">
                    {currentBanner.subtitle}
                  </p>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentBanner.title}
                </h3>
                
                {/* Live indicator or countdown */}
                {currentBanner.liveIndicator && (
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <span className="font-medium">{currentBanner.urgency}</span>
                  </div>
                )}
                
                {bannerType === 'urgency' && (
                  <div className="flex items-center gap-4 text-white text-lg font-mono">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                      <div className="text-xs uppercase">Hours</div>
                    </div>
                    <span className="text-2xl">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                      <div className="text-xs uppercase">Minutes</div>
                    </div>
                    <span className="text-2xl">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                      <div className="text-xs uppercase">Seconds</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Main message */}
              <p className="text-gray-300 text-lg leading-relaxed">
                {currentBanner.message}
              </p>
              
              {/* Pricing display for urgency banner */}
              {currentBanner.originalPrice && (
                <div className="flex items-center justify-center gap-4 py-4">
                  <span className="text-gray-500 line-through text-2xl">
                    {currentBanner.originalPrice}
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                  >
                    {currentBanner.discountPrice}
                  </motion.span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {currentBanner.savings}
                  </span>
                </div>
              )}
              
              {/* Features list */}
              {currentBanner.features && (
                <div className="space-y-2">
                  {currentBanner.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <FiCheckCircle className="text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Testimonial */}
              {currentBanner.testimonial && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 italic mb-2">
                    "{currentBanner.testimonial.message}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full" />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {currentBanner.testimonial.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {currentBanner.testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats */}
              {currentBanner.stats && (
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-800">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                      className="text-2xl font-bold text-cyan-400"
                    >
                      {currentBanner.stats.users}
                    </motion.div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      className="text-2xl font-bold text-green-400"
                    >
                      {currentBanner.stats.success}
                    </motion.div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                      className="text-2xl font-bold text-purple-400"
                    >
                      {currentBanner.stats.jobs}
                    </motion.div>
                    <div className="text-xs text-gray-500">Jobs Posted</div>
                  </div>
                </div>
              )}
              
              {/* CTAs */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCTA}
                  className={`w-full py-4 rounded-xl font-bold bg-gradient-to-r ${currentBanner.color} text-black shadow-lg hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center gap-2`}
                >
                  {currentBanner.cta}
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
                
                {currentBanner.secondaryCta && (
                  <button
                    onClick={() => navigate('/about')}
                    className="w-full py-3 rounded-xl font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    {currentBanner.secondaryCta}
                  </button>
                )}
              </div>
              
              {/* Trust badges */}
              {currentBanner.trustBadges && (
                <div className="flex items-center justify-center gap-6 pt-4">
                  {currentBanner.trustBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs text-gray-500">
                      <FiShield className="w-3 h-3" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Urgency indicator */}
              {currentBanner.urgency && !currentBanner.liveIndicator && (
                <p className="text-center text-sm text-yellow-400 font-medium">
                  ⚡ {currentBanner.urgency}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // Premium Mobile Banner Component
  const PremiumMobileBanner = () => (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="relative">
          {/* Gradient border effect */}
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${currentBanner.color}`} />
          
          <div className="bg-black/95 backdrop-blur-xl border-t border-gray-800 p-4">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur rounded-full p-1.5"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
            
            <div className="space-y-4">
              {/* Header with icon */}
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`p-2 rounded-lg bg-gradient-to-br ${currentBanner.color}`}
                >
                  <currentBanner.icon className="w-6 h-6 text-black" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {currentBanner.title}
                  </h3>
                  {currentBanner.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {currentBanner.subtitle}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Message */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentBanner.message}
              </p>
              
              {/* Mobile optimized features */}
              {currentBanner.features && currentBanner.features.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiCheckCircle className="text-green-400" />
                  <span>{currentBanner.features[0]}</span>
                  {currentBanner.features.length > 1 && (
                    <span className="text-gray-600">+{currentBanner.features.length - 1} more</span>
                  )}
                </div>
              )}
              
              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCTA}
                className={`w-full py-3 rounded-lg font-bold bg-gradient-to-r ${currentBanner.color} text-black shadow-lg text-sm flex items-center justify-center gap-2`}
              >
                {currentBanner.cta}
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
              
              {/* Trust indicators bar */}
              <div className="flex items-center justify-around text-xs text-gray-500 pt-2 border-t border-gray-800">
                <span className="flex items-center gap-1">
                  <FiUsers className="w-3 h-3" />
                  10k+ Users
                </span>
                <span className="flex items-center gap-1">
                  <FiStar className="w-3 h-3 text-yellow-400" />
                  4.9 Rating
                </span>
                <span className="flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 text-green-400" />
                  92% Success
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <PremiumDesktopBanner />
      <PremiumMobileBanner />
      
      {/* Floating pulse indicator */}
      {currentBanner.liveIndicator && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-6 lg:bottom-8 lg:right-96 z-40"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">{liveUsers}</span>
            </div>
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
          </motion.div>
          <p className="text-xs text-gray-400 text-center mt-1">Live Now</p>
        </motion.div>
      )}
      
      <style jsx>{`
        @keyframes slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(20px);
          }
        }
      `}</style>
    </>
  );
};

export default MarketingBanner;
