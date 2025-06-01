import React from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ShieldCheck } from 'lucide-react';

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

const howItWorksSteps = [
  { icon: <Search className="w-12 h-12 text-purple-400" />, title: "Find Your Ride", description: "Browse thousands of verified listings with advanced filters." },
  { icon: <MessageSquare className="w-12 h-12 text-pink-400" />, title: "Connect & Negotiate", description: "Chat securely with sellers and agree on the best price." },
  { icon: <ShieldCheck className="w-12 h-12 text-orange-400" />, title: "Secure & Easy Purchase", description: "Finalize your purchase with our trusted process and support." },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">How Your2ndRide Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {howItWorksSteps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="glassmorphism-card p-8 text-center text-gray-800 dark:text-gray-200"
          >
            <div className="flex justify-center mb-6">{step.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;