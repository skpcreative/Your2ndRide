import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const AdminRoleCheck = () => {
  const { user } = useAuth();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Checking role for user ID:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching role:', error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        console.log('Role data:', data);
        setRole(data?.role || 'unknown');
      } catch (err) {
        console.error('Exception checking role:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkRole();
  }, [user]);

  if (loading) return <div>Loading role information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="p-4 bg-slate-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">User Role Check</h2>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {role}</p>
      <p className="mt-4">
        {role === 'admin' 
          ? '✅ You have admin privileges' 
          : '❌ You do not have admin privileges'}
      </p>
    </div>
  );
};

export default AdminRoleCheck;
