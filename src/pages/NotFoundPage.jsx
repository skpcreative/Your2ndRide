
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4"
    >
      <AlertTriangle className="w-32 h-32 text-orange-400 mb-8 animate-bounce" />
      <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mb-6">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-200 mb-4">Oops! Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-10 max-w-md">
        The page you're looking for seems to have taken a wrong turn. Don't worry, it happens to the best of us!
      </p>
      <Link to="/">
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Home className="mr-2 h-5 w-5" />
          Go Back Home
        </Button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;
