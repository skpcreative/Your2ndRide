import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="text-center">
        <BarChart3 className="mx-auto h-16 w-16 text-green-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-lime-500 to-yellow-500 mb-6">Site Analytics</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          This section is under construction. View site usage statistics and trends.
        </p>
        <div className="mt-10 p-8 bg-slate-800 rounded-xl shadow-xl">
          <p className="text-gray-400">Charts, graphs, and key metrics (e.g., user registrations, listings posted, page views) will be displayed here. This will require Supabase for data collection and potentially a charting library.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAnalyticsPage;