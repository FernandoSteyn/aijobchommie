import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';

const ManagerDashboard = () => {
  const [financialData, setFinancialData] = useState({});
  const [usageMetrics, setUsageMetrics] = useState({});
  const [problems, setProblems] = useState([]);

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

    fetchFinancialData();
    fetchUsageMetrics();
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Manager's Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Financial Data */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiDollarSign className="mr-2 text-cyan-400" /> Financial Overview
            </h2>
            <p>Total Revenue: R {financialData.totalRevenue}</p>
            <p>Monthly Recurring Revenue: R {financialData.monthlyRevenue}</p>
            <p>Active Subscriptions: {financialData.activeSubscriptions}</p>
          </div>
          {/* Usage Metrics */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiBarChart2 className="mr-2 text-green-400" /> Usage Metrics
            </h2>
            <p>Daily Active Users: {usageMetrics.dailyActiveUsers}</p>
            <p>Monthly Active Users: {usageMetrics.monthlyActiveUsers}</p>
            <p>New Signups This Month: {usageMetrics.newSignups}</p>
          </div>
          {/* Potential Problems */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
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
              <p>No issues detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
