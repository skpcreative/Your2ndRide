import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * A custom hook for fetching a single vehicle listing by ID
 * @param {string} listingId - The ID of the vehicle listing to fetch
 * @returns {Object} - { listing, loading, error }
 */
export const useVehicleDetail = (listingId) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!listingId) {
      setListing(null);
      setLoading(false);
      return;
    }
    
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // First fetch the listing
        const { data: listingData, error: listingError } = await supabase
          .from('vehicle_listings')
          .select('*')
          .eq('id', listingId)
          .single();
          
        if (listingError) throw listingError;
        
        // Then fetch the seller profile separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, created_at')
          .eq('id', listingData.user_id)
          .single();
          
        // Combine the data
        const data = {
          ...listingData,
          profiles: profileError ? null : profileData
        };
        
        // Check for errors
        const queryError = listingError || (profileError && profileError.code !== 'PGRST116');
        
        if (queryError) throw queryError;
        
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
    
    // Set up real-time subscription for this specific listing
    const channel = supabase
      .channel(`listing-${listingId}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_listings',
          filter: `id=eq.${listingId}`
        },
        () => {
          // Refetch listing when there are changes
          fetchListing();
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [listingId]);
  
  return { listing, loading, error };
};
