import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff, Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

/**
 * A button component for adding/removing vehicles from the wishlist
 * @param {Object} props
 * @param {string} props.vehicleId - The ID of the vehicle
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant
 * @param {string} props.size - Button size
 * @returns {JSX.Element}
 */
const WishlistButton = ({ 
  vehicleId, 
  className = '', 
  variant = 'outline', 
  size = 'icon'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // isInWishlist returns the wishlist ID if the item is in the wishlist, or false if not
  const wishlistId = isInWishlist(vehicleId);
  const inWishlist = Boolean(wishlistId);
  
  const handleWishlistAction = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      if (inWishlist) {
        // Remove from wishlist
        const success = await removeFromWishlist(vehicleId);
        if (success) {
          toast({
            title: 'Removed from wishlist',
            description: 'Vehicle has been removed from your wishlist',
          });
        }
      } else {
        // Add to wishlist
        const success = await addToWishlist(vehicleId);
        if (success) {
          toast({
            title: 'Added to wishlist',
            description: 'Vehicle has been added to your wishlist',
          });
        }
      }
    } catch (error) {
      console.error('Wishlist action error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${inWishlist ? 'bg-pink-600 text-white hover:bg-pink-700' : ''}`}
      onClick={handleWishlistAction}
      disabled={isLoading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : inWishlist ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
    </Button>
  );
};

export default WishlistButton;
