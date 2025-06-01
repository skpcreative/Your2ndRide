import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

const dummyRecentListings = [
  { id: 4, name: 'Luxury Coupe Elegance', price: 55000, year: 2020, mileage: '15,000 miles', image: 'Luxury coupe parked in front of a modern villa' },
  { id: 5, name: 'Family Minivan Voyager', price: 29000, year: 2022, mileage: '10,000 miles', image: 'Minivan packed for a family vacation by a lake' },
  { id: 6, name: 'Sporty Roadster Sprint', price: 42000, year: 2021, mileage: '8,000 miles', image: 'Sporty roadster driving along a coastal highway' },
];

const RecentListingsSection = () => {
  return (
    <section className="py-16 bg-slate-800/50 rounded-xl">
      <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">Recently Added</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {dummyRecentListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            custom={index} 
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-slate-700 p-6 rounded-lg shadow-xl hover:shadow-teal-500/30 transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="w-full h-48 bg-slate-600 rounded-md mb-4 flex items-center justify-center overflow-hidden">
              <img  className="w-full h-full object-cover" alt={listing.image} src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
            </div>
            <h3 className="text-xl font-semibold text-teal-300 mb-2">{listing.name}</h3>
            <p className="text-gray-400 mb-1">{listing.year} - {listing.mileage}</p>
            <p className="text-2xl font-bold text-green-400 mb-4">₹{listing.price.toLocaleString()}</p>
            <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700">
              <Link to={`/listing/${listing.id}`}>View Details</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentListingsSection;