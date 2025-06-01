import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Car, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center py-20 px-4 rounded-xl bg-gradient-to-tr from-purple-700 via-pink-600 to-orange-500 shadow-2xl"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl md:text-6xl font-extrabold text-white mb-6"
      >
        Find Your Next <span className="text-yellow-300">Dream Ride</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto"
      >
        Your2ndRide is the ultimate platform for buying and selling quality pre-owned vehicles. Start your journey today!
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100 shadow-md transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
          <Link to="/buy">Browse Cars <Car className="ml-2 h-5 w-5" /></Link>
        </Button>
        <Button size="lg" asChild className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 shadow-md transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto font-semibold hover:shadow-lg">
          <Link to="/sell">Sell Your Car <TrendingUp className="ml-2 h-5 w-5" /></Link>
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;