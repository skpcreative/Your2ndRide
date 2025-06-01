import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Car, CalendarDays, Gauge, Star, MapPin, ChevronDown, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useVehicleListings } from '@/hooks/useVehicleListings';
import WishlistButton from '@/components/WishlistButton';

// Get unique makes from the database to use as vehicle types
const vehicleTypes = ['All', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai'];

const BuyPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    maxMileage: '',
    vehicleType: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  
  // Use the vehicle listings hook to get real-time data
  const { listings, loading, error, applyFilters } = useVehicleListings({ status: 'approved' });
  
  // Apply filters when they change
  useEffect(() => {
    const filtersToApply = {
      searchTerm,
      minPrice: filters.minPrice ? Number(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
      minYear: filters.minYear ? Number(filters.minYear) : null,
      maxYear: filters.maxYear ? Number(filters.maxYear) : null,
      maxMileage: filters.maxMileage ? Number(filters.maxMileage) : null,
      vehicleType: filters.vehicleType
    };
    
    // Only apply filters if they've changed
    if (JSON.stringify(filtersToApply) !== JSON.stringify(currentFilters)) {
      setCurrentFilters(filtersToApply);
      applyFilters(filtersToApply);
    }
  }, [searchTerm, filters, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      maxMileage: '',
      vehicleType: 'All'
    });
    setSearchTerm('');
  };
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-xl text-gray-300">Loading vehicles...</p>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-3xl font-semibold text-gray-300 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-8">{error.message || 'Error loading vehicles'}</p>
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Try Again
        </Button>
      </div>
    );
  }

  const cardVariants = {
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

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-800"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
          Find Your Perfect Vehicle
        </h1>
        
        <div className="flex flex-col gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by make, model, or location..."
              className="pl-10 bg-slate-800 border-slate-700 placeholder-slate-400 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)} 
              className="flex items-center gap-2 border-slate-700 text-slate-300"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {showFilters ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {filters.minPrice || filters.maxPrice || filters.minYear || filters.maxYear || filters.maxMileage || filters.vehicleType !== 'All' ? (
              <Button 
                variant="ghost" 
                onClick={resetFilters} 
                className="text-purple-400 hover:text-purple-300"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            ) : null}
          </div>
        </div>
      </motion.div>
      
      {showFilters ? (
        <div className="bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min $"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="bg-slate-800 border-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max $"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="bg-slate-800 border-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Year Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min Year"
                  name="minYear"
                  value={filters.minYear}
                  onChange={handleFilterChange}
                  className="bg-slate-800 border-slate-700 placeholder-slate-400"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Year"
                  name="maxYear"
                  value={filters.maxYear}
                  onChange={handleFilterChange}
                  className="bg-slate-800 border-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Max Mileage</label>
            <Input
              type="number"
              placeholder="Max Mileage"
              name="maxMileage"
              value={filters.maxMileage}
              onChange={handleFilterChange}
              className="bg-slate-800 border-slate-700 placeholder-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Type</label>
            <select
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleFilterChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-md p-2"
            >
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <Button 
            variant="outline" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <AnimatePresence>
            {listings.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="col-span-full text-center py-16 bg-slate-800 rounded-xl shadow-lg"
              >
                <Car className="w-24 h-24 text-gray-500 mx-auto mb-6" />
                <h2 className="text-3xl font-semibold text-gray-300 mb-4">No Vehicles Found</h2>
                <p className="text-gray-400 mb-8">Try adjusting your filters or check back later for new listings.</p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </motion.div>
            ) : (
              listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                >
                  <Card className="bg-slate-900 border border-slate-800 overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="p-0 relative group">
                      <div className="w-full h-24 sm:h-40 bg-slate-800 flex items-center justify-center overflow-hidden relative">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          alt={listing.title} 
                          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white font-medium text-sm">Click to view details</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <WishlistButton vehicleId={listing.id} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-3 flex-1 flex flex-col">
                      <CardTitle className="text-[10px] sm:text-base font-bold text-white mb-0.5 line-clamp-1">{listing.title}</CardTitle>
                      <div className="flex items-center text-slate-400 text-[10px] sm:text-sm mb-0.5">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.location || 'Location not specified'}</span>
                      </div>
                      <div className="mt-2 mb-4">
                        <div className="text-sm sm:text-xl font-bold text-amber-400 mb-0.5 sm:mb-2">${parseFloat(listing.price).toLocaleString()}</div>
                        <div className="space-y-2">
                          <div className="flex items-center text-slate-300 text-sm">
                            <Gauge className="w-4 h-4 mr-2 text-blue-400" />
                            <span>{listing.mileage ? `${listing.mileage.toLocaleString()} miles` : 'Mileage not specified'}</span>
                          </div>
                          <div className="flex items-center text-slate-300 text-sm">
                            <CalendarDays className="w-4 h-4 mr-2 text-green-400" />
                            <span>{listing.make} {listing.model} • {listing.year}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-7 sm:h-9 text-[10px] sm:text-sm font-medium rounded">
                        <Link to={`/listing/${listing.id}`} className="flex items-center justify-center">
                          <Car className="mr-1 h-3 w-3 sm:h-5 sm:w-5" /> View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {listings.length > 0 && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            Load More Vehicles
          </Button>
        </div>
      )}
    </div>
  );
};

export default BuyPage;