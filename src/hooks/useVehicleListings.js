import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

/**
 * A custom hook for fetching and filtering vehicle listings
 * @param {Object} options - Options for filtering listings
 * @param {string} options.status - Filter by listing status (approved, pending, rejected)
 * @returns {Object} - { listings, loading, error, count, applyFilters }
 */
export const useVehicleListings = (options = {}) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});
  
  // Default to showing only approved listings for regular users
  const { status = 'approved' } = options;
  
  // Fetch listings with filters
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from('vehicle_listings')
          .select('*', { count: 'exact' })
          .eq('status', status);
        
        // Apply search term filter if provided
        if (appliedFilters.searchTerm) {
          query = query.or(
            `title.ilike.%${appliedFilters.searchTerm}%,make.ilike.%${appliedFilters.searchTerm}%,model.ilike.%${appliedFilters.searchTerm}%`
          );
        }
        
        // Apply price filters if provided
        if (appliedFilters.minPrice) {
          query = query.gte('price', appliedFilters.minPrice);
        }
        if (appliedFilters.maxPrice) {
          query = query.lte('price', appliedFilters.maxPrice);
        }
        
        // Apply year filters if provided
        if (appliedFilters.minYear) {
          query = query.gte('year', appliedFilters.minYear);
        }
        if (appliedFilters.maxYear) {
          query = query.lte('year', appliedFilters.maxYear);
        }
        
        // Apply mileage filter if provided
        if (appliedFilters.maxMileage) {
          query = query.lte('mileage', appliedFilters.maxMileage);
        }
        
        // Apply vehicle type filter if provided
        if (appliedFilters.vehicleType && appliedFilters.vehicleType !== 'All') {
          query = query.eq('make', appliedFilters.vehicleType);
        }
        
        // Execute the query
        const { data, error: queryError, count: totalCount } = await query;
        
        if (queryError) throw queryError;
        
        setListings(data || []);
        setCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
    
    // Set up real-time subscription for vehicle_listings
    const channel = supabase
      .channel('vehicle-listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_listings',
          filter: `status=eq.${status}`
        },
        () => {
          // Refetch listings when there are changes
          fetchListings();
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [status, appliedFilters]);
  
  // Function to apply filters
  const applyFilters = (filters) => {
    setAppliedFilters(filters);
  };
  
  // No need for a separate error effect since we're setting the error directly
  
  return { 
    listings, 
    loading, 
    error, 
    count,
    applyFilters
  };
};

/**
 * A custom hook for fetching a user's own vehicle listings
 * @returns {Object} - { userListings, loading, error, count }
 */
export const useUserVehicleListings = () => {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!user) {
      setUserListings([]);
      setLoading(false);
      return;
    }
    
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        
        const { data, error, count: totalCount } = await supabase
          .from('vehicle_listings')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUserListings(data || []);
        setCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching user listings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserListings();
    
    // Set up real-time subscription for the user's listings
    const channel = supabase
      .channel('user-listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_listings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch listings when there are changes
          fetchUserListings();
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [user]);
  
  return { userListings, loading, error, count };
};
