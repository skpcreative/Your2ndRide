import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }
      
      try {
        // Use RPC to avoid policy recursion issues
        const { data, error } = await supabase.rpc('get_user_role', {
          user_id: user.id
        });
        
        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }
        
        console.log('User role data in AdminProtectedRoute:', data);
        setIsAdmin(data === 'admin');
        setCheckingAdmin(false);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    };
    
    if (isAuthenticated) {
      checkAdminRole();
    } else {
      setCheckingAdmin(false);
    }
  }, [user, isAuthenticated]);

  // Show loading state while checking authentication and admin status
  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Allow access to admin routes
  return <Outlet />;
};

export default AdminProtectedRoute;
