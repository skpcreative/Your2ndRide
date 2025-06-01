import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminBansPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="text-center">
        <Ban className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 mb-6">Ban Management</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          This section is under construction. Manage banned users and appeals.
        </p>
        <div className="mt-10 p-8 bg-slate-800 rounded-xl shadow-xl">
          <p className="text-gray-400">Banned user list, ban/unban actions, and appeal review system will be built here after Supabase setup.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBansPage;