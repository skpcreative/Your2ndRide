import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

/**
 * A custom hook for managing wishlist functionality
 * @returns {Object} - { wishlistItems, isInWishlist, addToWishlist, removeFromWishlist, loading, error }
 */
export const useWishlist = () => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  
  // Store wishlist data and loading state
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState(null);
  
  // Fetch wishlist data using the RPC function
  useEffect(() => {
    if (!user) {
      setWishlistData([]);
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    const fetchWishlistData = async () => {
      try {
        setLoading(true);
        
        // Use the RPC function to avoid recursion issues
        const { data, error } = await supabase.rpc('get_user_wishlist', {
          user_id_param: user.id
        });
        
        if (error) throw error;
        
        // Process the data
        const wishlistData = data || [];
        setWishlistData(wishlistData);
        
        // Extract vehicle data from the combined result
        const vehicleItems = wishlistData.map(item => ({
          ...item.vehicle_data,
          wishlist_id: item.id
        }));
        
        setWishlistItems(vehicleItems);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setWishlistError(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlistData();
    
    // Set up a subscription to refresh data when needed
    const channel = supabase.channel('wishlist-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wishlists',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchWishlistData();
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [user]);
  
  // Check if a vehicle is in the wishlist and return the wishlist item if found
  const isInWishlist = (vehicleId) => {
    const item = wishlistData?.find(item => item.vehicle_id === vehicleId);
    return item ? item.id : false;
  };
  
  // Add a vehicle to the wishlist
  const addToWishlist = async (vehicleId) => {
    if (!user) {
      setError(new Error('You must be logged in to add items to your wishlist'));
      return false;
    }
    
    try {
      const { error: insertError } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          vehicle_id: vehicleId
        });
      
      if (insertError) throw insertError;
      return true;
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError(err);
      return false;
    }
  };
  
  // Remove a vehicle from the wishlist
  const removeFromWishlist = async (vehicleId) => {
    if (!user) {
      setError(new Error('You must be logged in to remove items from your wishlist'));
      return false;
    }
    
    try {
      // Find the wishlist item for this vehicle
      const wishlistItem = wishlistData?.find(item => item.vehicle_id === vehicleId);
      
      if (!wishlistItem) {
        throw new Error('Item not found in wishlist');
      }
      
      // Use RPC to safely delete the wishlist item
      const { error: deleteError } = await supabase.rpc('delete_wishlist_item', {
        wishlist_id_param: wishlistItem.id,
        user_id_param: user.id
      });
      
      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError(err);
      return false;
    }
  };
  
  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
    error: error || wishlistError
  };
};
