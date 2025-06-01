import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * A custom hook for subscribing to Supabase real-time changes
 * @param {string} table - The table to subscribe to
 * @param {Object} options - Additional options for the subscription
 * @param {Function} options.filter - A function to filter the query
 * @param {string} options.event - The event to subscribe to (INSERT, UPDATE, DELETE, *)
 * @param {string} options.schema - The schema to use (default: 'public')
 * @returns {Object} - { data, error, loading, count }
 */
export const useSupabaseRealtime = (table, options = {}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const {
    filter = (query) => query,
    event = '*',
    schema = 'public',
  } = options;

  // Initial fetch and subscription setup
  useEffect(() => {
    setLoading(true);
    
    // Initial fetch
    const fetchData = async () => {
      try {
        // Get count first
        const { count: totalCount, error: countError } = await filter(
          supabase.from(table).select('*', { count: 'exact', head: true })
        );
        
        if (countError) throw countError;
        setCount(totalCount || 0);
        
        // Then get actual data
        // Use the filter function which should include any joins or additional select fields
        const { data: initialData, error: dataError } = await filter(
          supabase.from(table)
        );
        
        if (dataError) throw dataError;
        setData(initialData || []);
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
        },
        async (payload) => {
          // Refetch data on any change to ensure we have the latest
          // Use the filter function which should include any joins or additional select fields
          const { data: refreshedData, error: refreshError } = await filter(
            supabase.from(table)
          );
          
          if (refreshError) {
            console.error(`Error refreshing ${table}:`, refreshError);
            return;
          }
          
          setData(refreshedData || []);
          
          // Update count
          const { count: newCount, error: countError } = await filter(
            supabase.from(table).select('*', { count: 'exact', head: true })
          );
          
          if (!countError) {
            setCount(newCount || 0);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [table, JSON.stringify(options)]);

  return { data, error, loading, count };
};
