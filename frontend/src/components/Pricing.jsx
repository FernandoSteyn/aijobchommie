import React, { useState } from 'react';
import { FiCheck, FiX, FiZap, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Pricing = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const plans = {
    basic: {
      name: 'Basic',
price: 8,
      currency: 'ZAR',
      period: 'month',
      color: 'cyan',
      features: [
        { text: 'Upload CV/Resume', included: true },
        { text: 'View 10 jobs per day', included: true },
        { text: 'Basic job matching', included: true },
        { text: 'Manual applications', included: true },
        { text: 'Email support', included: true },
        { text: 'AI Cover Letters', included: false },
        { text: 'Auto-apply to jobs', included: false },
        { text: 'Priority support', included: false },
        { text: 'Unlimited job views', included: false },
        { text: 'Advanced AI matching', included: false }
      ]
    },
    premium: {
      name: 'Premium',
price: 17,
      currency: 'ZAR',
      period: 'month',
      color: 'pink',
      popular: true,
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Unlimited job views', included: true },
        { text: 'Advanced AI matching', included: true },
        { text: 'AI Cover Letters', included: true },
        { text: 'Auto-apply to jobs', included: true },
        { text: 'Priority support', included: true },
        { text: 'Interview preparation', included: true },
        { text: 'Salary insights', included: true },
        { text: 'Job alerts', included: true },
        { text: 'Profile analytics', included: true }
      ]
    }
  };

  const handleSelectPlan = async (planType) => {
    if (!user) {
      toast.error('Please login to select a plan');
      navigate('/login');
      return;
    }

    // Both plans require payment now
    const selectedPlanData = plans[planType];

    setSelectedPlan(planType);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/paystack/initialize`,
        {
          email: user.email,
          amount: selectedPlanData.price,
          metadata: {
            plan: planType,
            userId: user.id
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`
          }
        }
      );

      if (response.data.status && response.data.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Start finding your dream job today
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                  : 'border-gray-800'
              } bg-gray-900/50 backdrop-blur-sm p-8`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <FiStar className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 text-${plan.color}-400`}>
                  {plan.name}
                </h2>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">
                    {plan.currency} {plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <FiCheck className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included ? 'text-gray-300' : 'text-gray-600'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(key)}
                disabled={loading && selectedPlan === key}
                className={`w-full py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                    : 'bg-gray-800 text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === key ? (
                  <span className="flex items-center justify-center">
                    <FiZap className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  `Get ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Trusted by thousands of South Africans</p>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">10k+</div>
              <div className="text-gray-500 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">85%</div>
              <div className="text-gray-500 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">4.8★</div>
              <div className="text-gray-500 text-sm">User Rating</div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🔒 Secure payment powered by Paystack</p>
          <p>Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
