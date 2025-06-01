import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, IndianRupee, CalendarDays, Gauge, MessageSquare, Heart, MapPin, UserCircle, ShieldCheck, Star, Loader2, HeartOff, Phone } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useVehicleDetail } from '@/hooks/useVehicleDetail';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { ChatButton } from '@/components/chat/ChatButton';

// Helper function to format features from description
const extractFeatures = (description) => {
  if (!description) return [];
  
  // Try to extract features from bullet points in the description
  const bulletPointMatch = description.match(/[•\-\*]\s*([^\n]+)/g);
  if (bulletPointMatch && bulletPointMatch.length > 0) {
    return bulletPointMatch.map(point => point.replace(/^[•\-\*]\s*/, '').trim());
  }
  
  // If no bullet points, create generic features based on vehicle attributes
  return ['Well-maintained vehicle', 'Ready for test drive', 'Available for immediate purchase'];
};


const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { listing, loading, error } = useVehicleDetail(id);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Check if we should open chat from navigation state
  useEffect(() => {
    if (location.state?.openChat && user) {
      setIsChatOpen(true);
    }
  }, [location.state, user]);

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-24 h-24 text-purple-400 mx-auto mb-4 animate-spin" />
        <h1 className="text-3xl font-bold text-gray-300">Loading Vehicle Details</h1>
        <p className="text-gray-400">Please wait while we fetch the information...</p>
      </div>
    );
  }

  // Show error state
  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <Car className="w-24 h-24 text-orange-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-300">Listing Not Found</h1>
        <p className="text-gray-400">{error?.message || "The vehicle you're looking for might have been sold or removed."}</p>
        <Button asChild className="mt-8">
          <Link to="/buy">Back to Listings</Link>
        </Button>
      </div>
    );
  }
  
  // Extract features from description
  const features = extractFeatures(listing.description);
  
  // Check if listing is in wishlist
  const inWishlist = isInWishlist(listing.id);

  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to chat with the seller.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/listing/${id}` } });
      return;
    }
    
    try {
      setWishlistLoading(true);
      
      if (inWishlist) {
        // Remove from wishlist
        const success = await removeFromWishlist(listing.id);
        if (success) {
          toast({
            title: "Removed from Wishlist",
            description: `${listing.title} has been removed from your wishlist.`,
          });
        } else {
          throw new Error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const success = await addToWishlist(listing.id);
        if (success) {
          toast({
            title: "Added to Wishlist",
            description: `${listing.title} has been added to your wishlist.`,
          });
        } else {
          throw new Error("Failed to add to wishlist");
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
          <Link to="/buy"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <div className="w-full h-96 bg-slate-700 rounded-lg mb-4 overflow-hidden">
                {/* Main Image */}
                {listing.images && listing.images.length > 0 ? (
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover" 
                    alt={`${listing.make} ${listing.model}`} 
                    src={listing.images[currentImageIndex]} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700">
                    <Car className="w-24 h-24 text-slate-500" />
                  </div>
                )}
              </div>
              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-2">
                {listing.images && listing.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`w-full h-24 bg-slate-600 rounded overflow-hidden cursor-pointer transition-all duration-200 ${currentImageIndex === index ? 'ring-2 ring-purple-500 scale-95' : 'hover:ring-1 hover:ring-purple-400 hover:scale-105'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      className="w-full h-full object-cover" 
                      alt={`${listing.make} ${listing.model} view ${index + 1}`} 
                      src={img} 
                    />
                  </div>
                ))}
                {(!listing.images || listing.images.length < 4) && 
                  [...Array(4 - (listing.images?.length || 0))].map((_, i) => 
                    <div 
                      key={`placeholder-${i}`} 
                      className="w-full h-24 bg-slate-600 rounded flex items-center justify-center text-slate-500"
                    >
                      <Car className="w-8 h-8" />
                    </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mb-4">{listing.title}</CardTitle>
              <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
                <span className="flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-blue-400" /> Year: {listing.year}</span>
                <span className="flex items-center"><Gauge className="w-5 h-5 mr-2 text-green-400" /> Mileage: {listing.mileage.toLocaleString()} miles</span>
                <span className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-orange-400" /> Location: {listing.location}</span>
                <span className="flex items-center"><Car className="w-5 h-5 mr-2 text-purple-400" /> {listing.make} {listing.model}</span>
              </div>
              <h3 className="text-2xl font-semibold text-purple-300 mb-3">Description</h3>
              <p className="text-gray-400 leading-relaxed">{listing.description}</p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-8 mb-3">Features</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-400">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-teal-400" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-800 border-slate-700 shadow-xl sticky top-24">
            <CardHeader>
              <p className="text-4xl font-bold text-orange-400 text-center">₹{parseFloat(listing.price).toLocaleString()}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChatButton
                recipientId={listing.userId}
                listingId={listing.id}
                className="w-full"
                onAuthRequired={handleContactSeller}
                isOpen={isChatOpen}
                onOpenChange={setIsChatOpen}
              />
              <Button 
                onClick={handleWishlistToggle} 
                variant="outline" 
                size="lg" 
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : inWishlist ? (
                  <>
                    <HeartOff className="mr-2 h-5 w-5" /> Remove from Wishlist
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300">Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                {listing.profiles?.avatar_url ? (
                  <img 
                    src={listing.profiles.avatar_url} 
                    alt="Seller" 
                    className="w-10 h-10 rounded-full mr-3 object-cover" 
                  />
                ) : (
                  <UserCircle className="w-10 h-10 mr-3 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-200">{listing.profiles?.full_name || "Seller"}</p>
                  <p className="text-sm text-gray-400">
                    Member since {listing.profiles?.created_at ? 
                      format(new Date(listing.profiles.created_at), 'MMMM yyyy') : 
                      ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1 text-orange-400" /> 
                <p className="text-gray-300">{listing.location}</p>
              </div>
              {user && user.id !== listing.user_id && (
                <Button variant="link" className="text-purple-400 p-0 h-auto">View Seller Profile</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingDetailPage;