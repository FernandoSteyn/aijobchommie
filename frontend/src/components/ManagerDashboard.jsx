import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, FiBarChart2, FiAlertTriangle, FiUsers, FiTrendingUp, 
  FiActivity, FiPieChart, FiDownload, FiRefreshCw, FiFilter,
  FiDatabase, FiCpu, FiHardDrive, FiWifi, FiZap, FiShield,
  FiCalendar, FiClock, FiArrowUp, FiArrowDown, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiSettings, FiMail, FiPhone
} from 'react-icons/fi';
import { Line, Bar, Doughnut, Area } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import AILogo from './AILogo';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Financial Data States
  const [financialData, setFinancialData] = useState({
    totalRevenue: 125840,
    monthlyRevenue: 18420,
    yearlyRevenue: 221040,
    activeSubscriptions: 847,
    churnRate: 3.2,
    averageRevenue: 217,
    growthRate: 24.5,
    projectedRevenue: 28500
  });
  
  // Usage Metrics States
  const [usageMetrics, setUsageMetrics] = useState({
    dailyActiveUsers: 2841,
    weeklyActiveUsers: 8542,
    monthlyActiveUsers: 12485,
    newSignups: 342,
    conversionRate: 18.4,
    avgSessionDuration: '12m 34s',
    bounceRate: 24.5,
    pageViews: 184291
  });
  
  // System Health States
  const [systemHealth, setSystemHealth] = useState({
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 34,
    apiLatency: 124,
    uptime: 99.98,
    errorRate: 0.02,
    requestsPerMinute: 2847
  });
  
  // Problems/Alerts States
  const [problems, setProblems] = useState([
    { id: 1, type: 'warning', title: 'High API Usage', description: 'API calls approaching monthly limit (85%)', timestamp: new Date() },
    { id: 2, type: 'info', title: 'Scheduled Maintenance', description: 'Database maintenance scheduled for Sunday 2AM', timestamp: new Date() },
    { id: 3, type: 'success', title: 'Performance Improved', description: 'Response time improved by 15% after optimization', timestamp: new Date() }
  ]);
  
  // User Analytics
  const [userAnalytics, setUserAnalytics] = useState({
    byPlan: { basic: 5842, premium: 6643 },
    byLocation: { 'Gauteng': 4521, 'Western Cape': 3214, 'KZN': 2841, 'Eastern Cape': 1909 },
    byIndustry: { 'IT': 3421, 'Engineering': 2841, 'Finance': 2134, 'Healthcare': 1845, 'Other': 2244 }
  });

  // Cost Tracking States
  const [costData, setCostData] = useState({
    totalCost: 0,
    budgetRemaining: 150,
    budgetUsedPercentage: 0,
    breakdown: {},
    alerts: [],
    suggestions: [],
    status: 'healthy'
  });
  const [showCostModal, setShowCostModal] = useState(false);
  const [newCostEntry, setNewCostEntry] = useState({
    serviceName: '',
    costType: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    // Fetch financial data
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/financial`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setFinancialData(response.data);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      }
    };

    // Fetch usage metrics
    const fetchUsageMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setUsageMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch usage metrics:', error);
      }
    };

    // Fetch potential problems
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/problems`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setProblems(response.data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    // Fetch cost tracking data
    const fetchCostData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/cost-dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setCostData(response.data || costData);
      } catch (error) {
        console.error('Failed to fetch cost data:', error);
      }
    };

    fetchFinancialData();
    fetchUsageMetrics();
    fetchProblems();
    fetchCostData();
  }, []);

  // Handle adding new cost entry
  const handleAddCost = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/manager/costs/log`, newCostEntry, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      toast.success('Cost entry added successfully!');
      setShowCostModal(false);
      setNewCostEntry({ serviceName: '', costType: '', amount: '', description: '' });
      // Refresh cost data
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/cost-dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      setCostData(response.data || costData);
    } catch (error) {
      console.error('Failed to add cost entry:', error);
      toast.error('Failed to add cost entry');
    }
  };

  // Initialize cost tracking tables
  const initializeCostTracking = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/manager/costs/initialize`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      toast.success('Cost tracking initialized!');
    } catch (error) {
      console.error('Failed to initialize cost tracking:', error);
      toast.error('Failed to initialize cost tracking');
    }
  };

  // Get status color based on budget usage
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'healthy': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-12 px-4">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <AILogo size="md" />
      </div>
      
      <div className="max-w-6xl mx-auto pt-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">Manager Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Financial Data */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-cyan-400/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiDollarSign className="mr-2 text-cyan-400" /> Financial Overview
            </h2>
            <p>Total Revenue: R {financialData.totalRevenue || 0}</p>
            <p>Monthly Recurring Revenue: R {financialData.monthlyRevenue || 0}</p>
            <p>Active Subscriptions: {financialData.activeSubscriptions || 0}</p>
          </div>
          {/* Usage Metrics */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-400/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiBarChart2 className="mr-2 text-green-400" /> Usage Metrics
            </h2>
            <p>Daily Active Users: {usageMetrics.dailyActiveUsers || 0}</p>
            <p>Monthly Active Users: {usageMetrics.monthlyActiveUsers || 0}</p>
            <p>New Signups This Month: {usageMetrics.newSignups || 0}</p>
          </div>
          {/* Potential Problems */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-red-400/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiAlertTriangle className="mr-2 text-red-400" /> Potential Issues
            </h2>
            {problems.length > 0 ? (
              <ul className="list-disc pl-5">
                {problems.map((problem, index) => (
                  <li key={index} className="mb-2">
                    {problem.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-400">No issues detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
