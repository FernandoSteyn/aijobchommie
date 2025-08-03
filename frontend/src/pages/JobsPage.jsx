import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaSave, FaPaperPlane, FaEye, FaMapMarkerAlt, FaBriefcase, FaClock } from 'react-icons/fa';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Welder',
      company: 'ABC Manufacturing',
      location: 'Cape Town',
      salary: 'R25,000 - R35,000',
      type: 'Full-time',
      match: 95,
      description: 'Experienced welder needed for heavy industry projects...',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Fabrication Specialist',
      company: 'XYZ Industries',
      location: 'Port Elizabeth',
      salary: 'R20,000 - R28,000',
      type: 'Contract',
      match: 88,
      description: 'Skilled fabricator for custom metalwork projects...',
      posted: '3 days ago'
    },
    {
      id: 3,
      title: 'Workshop Supervisor',
      company: 'DEF Ltd',
      location: 'Durban',
      salary: 'R30,000 - R40,000',
      type: 'Full-time',
      match: 82,
      description: 'Lead and manage workshop operations team...',
      posted: '1 week ago'
    },
    {
      id: 4,
      title: 'Junior Welder',
      company: 'GHI Engineering',
      location: 'Johannesburg',
      salary: 'R15,000 - R20,000',
      type: 'Full-time',
      match: 75,
      description: 'Entry-level position for recent graduates...',
      posted: '4 days ago'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'for-you', label: 'For You', count: Math.floor(jobs.length * 0.6) },
    { id: 'saved', label: 'Saved', count: 2 },
    { id: 'applied', label: 'Applied', count: 5 }
  ];

  const handleQuickApply = async (jobId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Application sent successfully! 🚀');
      setLoading(false);
    }, 1500);
  };

  const handleSaveJob = (jobId) => {
    toast.success('Job saved to your list! 💾');
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Jobs</h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className="text-neon-cyan"
          >
            <FaFilter size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-neon-pink"
          >
            <FaSort size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, skills, companies..."
          className="input-neon pl-12 w-full"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mb-6 overflow-x-auto pb-2"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-black'
                : 'border border-gray-600 text-gray-400'
            }`}
          >
            {tab.label} ({tab.count})
          </motion.button>
        ))}
      </motion.div>

      {/* Job Cards */}
      <AnimatePresence>
        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: index * 0.1 }}
              className="card-3d p-6"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-1">{job.title}</h3>
                  <p className="text-gray-400">{job.company}</p>
                </div>
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
                  {job.match}% Match
                </motion.div>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-neon-pink" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaBriefcase className="text-neon-green" /> {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-neon-cyan" /> {job.type}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveJob(job.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-full hover:border-neon-cyan transition-all"
                >
                  <FaSave /> Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickApply(job.id)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-black rounded-full"
                >
                  <FaPaperPlane /> Quick Apply
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="flex items-center gap-2 px-4 py-2 border border-neon-pink rounded-full hover:bg-neon-pink hover:text-black transition-all"
                >
                  <FaEye /> View
                </motion.button>
              </div>

              {/* Posted Time */}
              <p className="text-xs text-gray-500 mt-4">{job.posted}</p>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Load More */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-neon-secondary w-full mt-8"
      >
        Load More Jobs
      </motion.button>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 w-full rounded-t-3xl p-6 border-t-2 border-neon-cyan"
            >
              <h3 className="text-xl text-neon-cyan mb-6">Filters</h3>
              {/* Add filter options here */}
              <p className="text-gray-400">Filter options coming soon...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsPage;
