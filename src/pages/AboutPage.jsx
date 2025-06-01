
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Eye, HeartHandshake as Handshake, Car } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO", image: "Portrait of Alex Johnson, CEO" },
    { name: "Maria Garcia", role: "Head of Operations", image: "Portrait of Maria Garcia, Head of Operations" },
    { name: "Sam Lee", role: "Lead Developer", image: "Portrait of Sam Lee, Lead Developer" },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="space-y-16 py-10">
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <Car className="w-20 h-20 text-purple-400 mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">About Your2ndRide</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          We are passionate about connecting buyers and sellers of pre-owned vehicles, making the process transparent, secure, and enjoyable for everyone. Your2ndRide is more than just a marketplace; it's a community built on trust and a shared love for cars.
        </p>
      </motion.section>

      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-3 gap-8 text-center"
      >
        <div className="glassmorphism-card p-8 text-gray-800 dark:text-gray-200">
          <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400">To revolutionize the used car market by providing a trustworthy, user-friendly platform that empowers both buyers and sellers with the tools and information they need.</p>
        </div>
        <div className="glassmorphism-card p-8 text-gray-800 dark:text-gray-200">
          <Eye className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-400">To be the most trusted and preferred online destination for buying and selling pre-owned vehicles globally, fostering a community of satisfied car enthusiasts.</p>
        </div>
        <div className="glassmorphism-card p-8 text-gray-800 dark:text-gray-200">
          <Handshake className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
          <p className="text-gray-600 dark:text-gray-400">Integrity, Transparency, Customer-Centricity, Innovation, and Community. These principles guide every decision we make.</p>
        </div>
      </motion.section>

      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-slate-800 p-6 rounded-lg shadow-xl text-center hover:shadow-purple-500/30 transition-shadow duration-300"
            >
              <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <img  className="w-full h-full object-cover" alt={member.name} src="https://images.unsplash.com/photo-1649015931204-15a3c789e6ea" />
              </div>
              <h3 className="text-xl font-semibold text-purple-300">{member.name}</h3>
              <p className="text-orange-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
