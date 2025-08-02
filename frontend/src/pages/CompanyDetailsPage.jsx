import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CompanyDetailsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <h1 className="text-2xl">Company Details</h1>
        <div className="w-8" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card-3d mb-8"
      >
        <h2 className="text-2xl text-neon-cyan mb-4">About the Company</h2>
        <p className="text-gray-300 leading-relaxed">
          Here goes the company description and other relevant information.
        </p>
      </motion.div>
    </div>
  );
};

export default CompanyDetailsPage;

