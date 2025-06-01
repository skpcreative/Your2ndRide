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

const dummyFeaturedListings = [
  { id: 1, name: 'Sleek Sedan Alpha', price: 26500, year: 2022, mileage: '12,000 miles', image: 'Modern sedan parked in a futuristic city' },
  { id: 2, name: 'Rugged SUV Titan', price: 32000, year: 2021, mileage: '28,000 miles', image: 'SUV conquering a challenging mountain pass' },
  { id: 3, name: 'Eco-Friendly Hatch', price: 18000, year: 2023, mileage: '5,000 miles', image: 'Electric hatchback charging in a green urban environment' },
];

const FeaturedListingsSection = () => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Featured Listings</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyFeaturedListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            custom={index}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-slate-800 p-6 rounded-lg shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="w-full h-48 bg-slate-700 rounded-md mb-4 flex items-center justify-center overflow-hidden">
              <img  className="w-full h-full object-cover" alt={listing.image} src="https://images.unsplash.com/photo-1590955504626-5c41184ecf67" />
            </div>
            <h3 className="text-xl font-semibold text-purple-300 mb-2">{listing.name}</h3>
            <p className="text-gray-400 mb-1">{listing.year} - {listing.mileage}</p>
            <p className="text-2xl font-bold text-orange-400 mb-4">₹{listing.price.toLocaleString()}</p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to={`/listing/${listing.id}`}>View Details</Link>
            </Button>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" size="lg" asChild className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
          <Link to="/buy">View All Listings</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedListingsSection;