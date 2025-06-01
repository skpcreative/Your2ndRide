import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const RealtimeReviewsSection = () => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400">What Our Users Say</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <motion.div 
            key={i}
            custom={i}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="glassmorphism-card p-6 text-gray-800 dark:text-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center text-white font-bold text-xl mr-3">
                U{i} 
              </div>
              <div>
                <p className="font-semibold">User {i}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_,idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">"This is a placeholder review. Real reviews will be fetched from Supabase once integrated. Great platform, easy to use!"</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">Posted on: May {20+i}, 2025</p>
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-8 text-gray-400">Real-time reviews powered by Supabase coming soon!</p>
    </section>
  );
};

export default RealtimeReviewsSection;