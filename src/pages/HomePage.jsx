import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Car, Search, TrendingUp, Users, ShieldCheck, MessageSquare, Star, Tag, CalendarClock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Animation variants
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

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const howItWorksSteps = [
    { icon: <Search className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />, title: "Find Your Ride", description: "Browse thousands of verified listings with advanced filters." },
    { icon: <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />, title: "Connect & Negotiate", description: "Chat securely with sellers and agree on the best price." },
    { icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />, title: "Secure & Easy Purchase", description: "Finalize your purchase with our trusted process and support." },
  ];

  const dummyFeaturedListings = [
    { id: 1, name: 'Sleek Sedan Alpha', price: 26500, year: 2022, mileage: '12,000 miles', image: 'Modern sedan parked in a futuristic city' },
    { id: 2, name: 'Rugged SUV Titan', price: 32000, year: 2021, mileage: '28,000 miles', image: 'SUV conquering a challenging mountain pass' },
    { id: 3, name: 'Eco-Friendly Hatch', price: 18000, year: 2023, mileage: '5,000 miles', image: 'Electric hatchback charging in a green urban environment' },
    { id: 4, name: 'Luxury Coupe Elegance', price: 55000, year: 2020, mileage: '15,000 miles', image: 'Luxury coupe parked in front of a modern villa' },
    { id: 5, name: 'Family Minivan Voyager', price: 29000, year: 2022, mileage: '10,000 miles', image: 'Minivan packed for a family vacation by a lake' },
    { id: 6, name: 'Sporty Roadster Sprint', price: 42000, year: 2021, mileage: '8,000 miles', image: 'Sporty roadster driving along a coastal highway' },
  ];

  const popularBrands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi"];
  const categories = [
    { name: "Sedan", icon: <Car className="w-5 h-5" /> },
    { name: "SUV", icon: <Car className="w-5 h-5" /> },
    { name: "Truck", icon: <Car className="w-5 h-5" /> },
    { name: "Hatchback", icon: <Car className="w-5 h-5" /> },
    { name: "Coupe", icon: <Car className="w-5 h-5" /> },
    { name: "Minivan", icon: <Car className="w-5 h-5" /> },
    { name: "Electric", icon: <Car className="w-5 h-5" /> }
  ];

  return (
    <div className="space-y-8 md:space-y-12 max-w-[1800px] mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center py-8 md:py-16 px-3 rounded-xl bg-gradient-to-tr from-purple-700 via-pink-600 to-orange-500 shadow-lg mx-1"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-5"
        >
          Find Your Next <span className="text-yellow-300">Dream Ride</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm sm:text-base md:text-lg text-purple-100 mb-4 md:mb-8 max-w-2xl mx-auto"
        >
          Your2ndRide is the ultimate platform for buying and selling quality pre-owned vehicles.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-md mx-auto"
        >
          <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100 shadow-md">
            <Link to="/buy">Browse Cars <Car className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" asChild className="bg-yellow-400 text-purple-800 hover:bg-yellow-500 shadow-md">
            <Link to="/sell">Sell Your Car <TrendingUp className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Featured Listings Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 mx-1"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6 px-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
            Featured Listings
          </h2>
          <Button variant="outline" size="sm" asChild className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
            <Link to="/buy">View All</Link>
          </Button>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent px-1">
            {dummyFeaturedListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={featureCardVariants}
                className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-slate-800 p-3 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
              >
                <div className="w-full h-40 sm:h-48 bg-slate-700 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover" alt={listing.image} src="https://images.unsplash.com/photo-1590955504626-5c41184ecf67" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-1">{listing.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">{listing.year} - {listing.mileage}</p>
                <p className="text-lg sm:text-xl font-bold text-orange-400 mb-2">${listing.price.toLocaleString()}</p>
                <Button asChild size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link to={`/listing/${listing.id}`}>View Details</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 mx-1"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardVariants}
              className="group bg-slate-800 hover:bg-slate-700 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-300"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:bg-purple-500/30 transition-colors duration-300">
                {category.icon}
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-300 text-center">
                {category.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Added Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 mx-1"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6 px-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
            Recently Added
          </h2>
          <Button variant="outline" size="sm" asChild className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white">
            <Link to="/buy?sort=newest">View All</Link>
          </Button>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent px-1">
            {dummyFeaturedListings.slice(0, 6).map((listing, index) => (
              <motion.div
                key={listing.id}
                custom={index}
                variants={featureCardVariants}
                className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-slate-800 p-3 rounded-lg shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300"
              >
                <div className="w-full h-40 sm:h-48 bg-slate-700 rounded-md mb-2 flex items-center justify-center overflow-hidden relative">
                  <img className="w-full h-full object-cover" alt={listing.image} src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
                  <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                    New
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-teal-300 mb-1">{listing.name}</h3>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs sm:text-sm text-gray-400">{listing.year} - {listing.mileage}</p>
                </div>
                <p className="text-lg sm:text-xl font-bold text-teal-400 mb-2">${listing.price.toLocaleString()}</p>
                <Button asChild size="sm" className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700">
                  <Link to={`/listing/${listing.id}`}>View Details</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 mx-1"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardVariants}
              className="bg-slate-800 p-4 sm:p-5 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-2 sm:mr-3">
                  {index + 1}
                </div>
                <div className="flex justify-center">{step.icon}</div>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-purple-300">{step.title}</h3>
              <p className="text-xs sm:text-sm text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular Brands Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 bg-slate-800/50 rounded-xl px-3 mx-1"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
          Popular Brands
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {popularBrands.map((brand, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardVariants}
              className="bg-slate-700 hover:bg-slate-600 p-2 sm:p-3 rounded-lg text-center cursor-pointer transition-colors duration-300"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-200">{brand}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="py-6 md:py-10 mx-1"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6 px-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400">
            Testimonials
          </h2>
          <Button variant="outline" size="sm" className="border-lime-500 text-lime-400 hover:bg-lime-500 hover:text-white">
            View All
          </Button>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-lime-500 scrollbar-track-transparent px-1">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                custom={i}
                variants={featureCardVariants}
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 bg-slate-800 p-4 sm:p-5 rounded-lg shadow-lg hover:shadow-lime-500/20 transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-lime-500 flex items-center justify-center text-white font-bold text-sm sm:text-base mr-3">
                    U{i}
                  </div>
                  <div>
                    <p className="font-semibold text-base sm:text-lg text-white">User {i}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_,idx) => <Star key={idx} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mt-2">"This is a placeholder review. Real reviews will be fetched from Supabase once integrated. Great platform, easy to use!"</p>
                <p className="text-xs text-gray-400 mt-2">Posted on: May {20+i}, 2025</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-8 md:py-12 bg-gradient-to-tr from-purple-700 via-pink-600 to-orange-500 rounded-xl shadow-lg mx-1"
      >
        <div className="container mx-auto text-center px-3">
          <Users className="w-10 h-10 md:w-12 md:h-12 text-white mx-auto mb-3 md:mb-5" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-white">
            Ready to Find Your Perfect Ride?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-purple-100 mb-4 md:mb-6 max-w-md mx-auto">
            Join thousands of happy customers who found their dream car through Your2ndRide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-md mx-auto">
            <Button size="lg" asChild className="bg-white text-purple-700 hover:bg-gray-100 shadow-md">
              <Link to="/buy">Browse Cars</Link>
            </Button>
            <Button size="lg" asChild className="bg-yellow-400 text-purple-800 hover:bg-yellow-500 shadow-md">
              <Link to="/sell">Sell Your Car</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;