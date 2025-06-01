import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminReportsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-orange-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 mb-6">Reports & Moderation</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          This section is under construction. Handle user reports and content moderation.
        </p>
        <div className="mt-10 p-8 bg-slate-800 rounded-xl shadow-xl">
          <p className="text-gray-400">Report queue, review tools, and moderation actions will be implemented here post-Supabase integration.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminReportsPage;