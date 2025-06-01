
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartOff, Car, DollarSign, CalendarDays, Gauge, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/hooks/useWishlist';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const WishlistPage = () => {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, loading, error } = useWishlist();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
        <p className="text-xl text-gray-300">Loading your wishlist...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-3xl font-semibold text-gray-300 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-8">{error.message || 'Error loading wishlist'}</p>
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Try Again
        </Button>
      </div>
    );
  }

  // Handle not logged in state
  if (!user) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-yellow-500 text-5xl mb-4">🔒</div>
        <h2 className="text-3xl font-semibold text-gray-300 mb-4">Login Required</h2>
        <p className="text-gray-400 mb-8">Please log in to view your wishlist</p>
        <Link to="/login">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">My Wishlist</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your saved vehicles. Keep an eye on your favorites and never miss a deal!
        </p>
      </motion.div>

      {wishlistItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center py-16 bg-slate-800 rounded-xl shadow-lg"
        >
          <HeartOff className="w-24 h-24 text-gray-500 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mb-8">Start browsing and add some vehicles you love!</p>
          <Link to="/buy">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Browse Cars
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {wishlistItems.map((item, index) => (
            <motion.custom
              key={item.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              component={Card}
              className="bg-slate-800 border-slate-700 overflow-hidden shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardHeader className="p-0 relative">
                <div className="w-full h-56 bg-slate-700 flex items-center justify-center">
                   <img className="w-full h-full object-cover" alt={item.title} 
                        src={item.images && item.images.length > 0 
                            ? item.images[0] 
                            : "https://images.unsplash.com/photo-1675023112817-52b789fd2ef0"} />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-700"
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from wishlist"
                >
                  <HeartOff className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-bold text-pink-300 mb-2">{item.title}</CardTitle>
                <div className="flex items-center text-gray-400 text-sm mb-1">
                  <DollarSign className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="text-xl font-semibold text-orange-400">${parseFloat(item.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm mb-1">
                  <Car className="w-4 h-4 mr-2 text-blue-400" />
                  {item.make} {item.model}
                </div>
                <div className="flex items-center text-gray-400 text-sm mb-1">
                  <CalendarDays className="w-4 h-4 mr-2 text-blue-400" />
                  Year: {item.year}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Gauge className="w-4 h-4 mr-2 text-green-400" />
                  Mileage: {item.mileage ? `${item.mileage.toLocaleString()} miles` : 'N/A'}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-slate-700/50">
                <Link to={`/listings/${item.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700">
                    View Details <Car className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </motion.custom>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
