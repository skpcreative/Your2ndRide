import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminChatPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="text-center">
        <MessageCircle className="mx-auto h-16 w-16 text-teal-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 mb-6">Chat Moderation</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          This section is under construction. Monitor and moderate user chats.
        </p>
        <div className="mt-10 p-8 bg-slate-800 rounded-xl shadow-xl">
          <p className="text-gray-400">A live chat monitoring interface, tools to flag/delete messages, and user communication logs will be available here once the chat system and Supabase integration are complete.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminChatPage;