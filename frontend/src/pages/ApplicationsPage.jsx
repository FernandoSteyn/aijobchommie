import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaCheckCircle, FaClock, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [applications] = useState([
    {
      id: 1,
      jobTitle: 'Senior Welder',
      company: 'ABC Manufacturing',
      appliedDate: '2 days ago',
      status: 'viewed',
      progress: 50,
      interviewDate: null
    },
    {
      id: 2,
      jobTitle: 'Fabrication Specialist',
      company: 'XYZ Industries',
      appliedDate: '1 week ago',
      status: 'interview',
      progress: 75,
      interviewDate: 'Tomorrow 10:00 AM'
    },
    {
      id: 3,
      jobTitle: 'Workshop Supervisor',
      company: 'DEF Ltd',
      appliedDate: '2 weeks ago',
      status: 'accepted',
      progress: 100,
      interviewDate: null
    },
    {
      id: 4,
      jobTitle: 'Junior Welder',
      company: 'GHI Engineering',
      appliedDate: '3 weeks ago',
      status: 'rejected',
      progress: 100,
      interviewDate: null
    }
  ]);

  const stats = {
    pending: applications.filter(app => app.status === 'pending' || app.status === 'viewed').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  const statusConfig = {
    pending: { color: 'var(--neon-yellow)', icon: FaClock, label: 'Pending' },
    viewed: { color: 'var(--neon-cyan)', icon: FaClock, label: 'Viewed' },
    interview: { color: 'var(--neon-blue)', icon: FaCalendarAlt, label: 'Interview' },
    accepted: { color: 'var(--neon-green)', icon: FaCheckCircle, label: 'Accepted' },
    rejected: { color: 'var(--neon-red)', icon: FaTimesCircle, label: 'Rejected' }
  };

  const timelineSteps = ['Applied', 'Viewed', 'Interview', 'Decision'];

  const getStepStatus = (status, stepIndex) => {
    const statusMap = {
      pending: 0,
      viewed: 1,
      interview: 2,
      accepted: 3,
      rejected: 3
    };
    return statusMap[status] >= stepIndex;
  };

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">My Applications</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-neon-pink"
        >
          <FaFilter size={24} />
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-3 mb-6"
      >
        {Object.entries(stats).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            className="card-3d text-center py-4"
          >
            <motion.h3
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-bold mb-1"
              style={{ color: statusConfig[key]?.color || 'var(--neon-cyan)' }}
            >
              {value}
            </motion.h3>
            <p className="text-xs text-gray-400 capitalize">{key}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app, index) => {
          const config = statusConfig[app.status];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="card-3d p-6"
            >
              {/* Application Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-neon-cyan">{app.jobTitle}</h3>
                  <p className="text-gray-400">{app.company}</p>
                  <p className="text-sm text-gray-500 mt-1">Applied: {app.appliedDate}</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ color: config.color }}
                >
                  <Icon size={24} />
                </motion.div>
              </div>

              {/* Timeline Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  {timelineSteps.map((step, stepIndex) => (
                    <motion.div
                      key={step}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + stepIndex * 0.1 }}
                      className="flex flex-col items-center flex-1"
                    >
                      <motion.div
                        animate={getStepStatus(app.status, stepIndex) ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 360, 360]
                        } : {}}
                        transition={{ duration: 1.5 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          getStepStatus(app.status, stepIndex)
                            ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-black'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                        style={{
                          boxShadow: getStepStatus(app.status, stepIndex)
                            ? '0 0 20px var(--neon-cyan)'
                            : 'none'
                        }}
                      >
                        {getStepStatus(app.status, stepIndex) ? '✓' : stepIndex + 1}
                      </motion.div>
                      <span className="text-xs text-gray-400 mt-1">{step}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${app.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                    style={{
                      boxShadow: '0 0 20px var(--neon-cyan)'
                    }}
                  />
                </div>
              </div>

              {/* Interview Info */}
              {app.interviewDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-neon-blue to-neon-purple p-3 rounded-lg text-black font-semibold"
                >
                  <FaCalendarAlt className="inline mr-2" />
                  Interview scheduled: {app.interviewDate}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="btn btn-neon-secondary text-sm"
                >
                  View Details
                </motion.button>
                {app.status === 'interview' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-neon-primary text-sm"
                  >
                    Prepare for Interview
                  </motion.button>
                )}
                {(app.status === 'pending' || app.status === 'viewed') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.success('Application withdrawn')}
                    className="btn border border-neon-red text-neon-red text-sm"
                  >
                    Withdraw
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-neon-cyan rounded-full"
            style={{
              left: `${20 * i}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
