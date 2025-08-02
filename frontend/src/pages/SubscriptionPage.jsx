import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaCrown, FaRocket, FaPiggyBank, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'FREE PLAN',
      price: 'R0',
      period: '/month',
      icon: FaPiggyBank,
      color: 'var(--neon-cyan)',
      features: [
        { text: '5 job applications per month', included: true },
        { text: 'Basic AI job matching', included: true },
        { text: 'CV storage', included: true },
        { text: 'Auto-apply to jobs', included: false },
        { text: 'Priority job matching', included: false },
        { text: 'AI-generated cover letters', included: false },
        { text: 'Interview preparation', included: false },
        { text: '24/7 Priority support', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'PREMIUM PLAN',
      price: 'R99',
      period: '/month',
      icon: FaCrown,
      color: 'var(--neon-pink)',
      recommended: true,
      savings: 'Save 90% on AI costs!',
      features: [
        { text: 'Unlimited job applications', included: true },
        { text: 'Advanced AI job matching', included: true },
        { text: 'CV storage & optimization', included: true },
        { text: 'Auto-apply to matching jobs', included: true },
        { text: 'Priority job matching', included: true },
        { text: 'AI-generated cover letters', included: true },
        { text: 'Interview preparation with AI coach', included: true },
        { text: '24/7 Priority support', included: true }
      ]
    }
  ];

  const benefits = [
    { icon: FaBolt, text: '90% cost savings with AI caching', color: 'var(--neon-yellow)' },
    { icon: FaRocket, text: 'Auto-apply to jobs while you sleep', color: 'var(--neon-cyan)' },
    { icon: FaCrown, text: 'AI cover letters that get noticed', color: 'var(--neon-pink)' },
    { icon: FaBolt, text: 'Interview prep with AI coach', color: 'var(--neon-green)' }
  ];

  const handleUpgrade = async () => {
    if (selectedPlan === 'free') {
      toast.success('You are already on the free plan!');
      return;
    }

    setLoading(true);
    // Simulate payment process
    setTimeout(() => {
      toast.success('Redirecting to secure payment...');
      // Would integrate with Paystack here
      setLoading(false);
    }, 1500);
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
        <h1 className="text-2xl">Upgrade Your Experience</h1>
        <div className="w-8" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-3xl mb-8"
      >
        Choose Your Plan
      </motion.h2>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            onClick={() => setSelectedPlan(plan.id)}
            className={`card-3d p-6 cursor-pointer relative ${
              selectedPlan === plan.id ? 'border-2' : ''
            }`}
            style={{
              borderColor: selectedPlan === plan.id ? plan.color : 'transparent',
              boxShadow: selectedPlan === plan.id 
                ? `0 0 40px ${plan.color}, 0 0 80px ${plan.color}` 
                : undefined
            }}
          >
            {/* Recommended Badge */}
            {plan.recommended && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-2 rounded-full text-black font-bold text-sm"
                style={{
                  boxShadow: '0 0 30px var(--neon-pink)'
                }}
              >
                RECOMMENDED
              </motion.div>
            )}

            {/* Plan Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex justify-center mb-4"
            >
              <plan.icon size={60} style={{ color: plan.color }} />
            </motion.div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-center mb-4" style={{ color: plan.color }}>
              {plan.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-6">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold"
                style={{ color: plan.color }}
              >
                {plan.price}
              </motion.span>
              <span className="text-gray-400">{plan.period}</span>
            </div>

            {/* Savings Badge */}
            {plan.savings && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-neon-green font-bold mb-4"
              >
                {plan.savings}
              </motion.p>
            )}

            {/* Features */}
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  {feature.included ? (
                    <FaCheck className="text-neon-green flex-shrink-0" />
                  ) : (
                    <FaTimes className="text-gray-500 flex-shrink-0" />
                  )}
                  <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Select Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full mt-6 py-3 rounded-full font-bold transition-all ${
                selectedPlan === plan.id
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-black'
                  : 'border-2 border-gray-600 text-gray-400'
              }`}
              style={{
                boxShadow: selectedPlan === plan.id ? `0 0 20px ${plan.color}` : 'none'
              }}
            >
              {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Why Upgrade Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <h3 className="text-xl text-neon-cyan mb-6 text-center">Why Upgrade?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, x: 10 }}
              className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700"
            >
              <benefit.icon size={24} style={{ color: benefit.color }} />
              <span className="text-white">{benefit.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpgrade}
        disabled={loading}
        className="btn btn-neon-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-dot w-2 h-2 mr-2"></span>
            <span className="loading-dot w-2 h-2 mr-2" style={{ animationDelay: '0.2s' }}></span>
            <span className="loading-dot w-2 h-2" style={{ animationDelay: '0.4s' }}></span>
          </span>
        ) : (
          selectedPlan === 'premium' ? 'Upgrade Now - Secure Payment via Paystack' : 'Continue with Free Plan'
        )}
      </motion.button>

      {/* Security Badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-center text-sm text-gray-400 mt-4"
      >
        🔒 Secure payment powered by Paystack
      </motion.p>

      {/* Floating Money Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: -50
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            💰
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
