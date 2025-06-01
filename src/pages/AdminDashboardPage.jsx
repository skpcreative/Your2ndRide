import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, ListChecks, ShieldAlert, Ban, Settings, BarChart3, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const adminSections = [
  { title: 'User Management', icon: <Users className="w-8 h-8" />, description: 'View, edit, and manage user accounts.', path: '/admin/users', color: 'text-purple-400' },
  { title: 'Listing Management', icon: <ListChecks className="w-8 h-8" />, description: 'Approve, reject, or remove vehicle listings.', path: '/admin/listings', color: 'text-pink-400' },
  { title: 'Reports & Moderation', icon: <ShieldAlert className="w-8 h-8" />, description: 'Handle user reports and content moderation.', path: '/admin/reports', color: 'text-orange-400' },
  { title: 'Ban Management', icon: <Ban className="w-8 h-8" />, description: 'Manage banned users and appeals.', path: '/admin/bans', color: 'text-red-400' },
  { title: 'Site Settings', icon: <Settings className="w-8 h-8" />, description: 'Configure global site parameters.', path: '/admin/settings', color: 'text-blue-400' },
  { title: 'Analytics', icon: <BarChart3 className="w-8 h-8" />, description: 'View site usage statistics and trends.', path: '/admin/analytics', color: 'text-green-400' },
  { title: 'Chat Moderation', icon: <MessageCircle className="w-8 h-8" />, description: 'Monitor and moderate user chats.', path: '/admin/chat', color: 'text-teal-400' },
];

const AdminDashboardPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">Admin Dashboard</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Welcome, Admin! Manage Your2ndRide platform efficiently from here.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminSections.map((section, index) => (
          <motion.custom
            key={section.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            component={Card}
            className="bg-slate-800 border-slate-700 overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
          >
            <CardHeader className="flex flex-row items-center space-x-4 p-6">
              <div className={section.color}>{section.icon}</div>
              <CardTitle className={`text-2xl font-bold ${section.color}`}>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <p className="text-gray-400">{section.description}</p>
            </CardContent>
            <CardFooter className="p-6 bg-slate-700/50">
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link to={section.path}>Go to {section.title.split(' ')[0]}</Link>
              </Button>
            </CardFooter>
          </motion.custom>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;