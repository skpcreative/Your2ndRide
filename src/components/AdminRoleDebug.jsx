import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminRoleDebug = () => {
  const { user } = useAuth();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [directRoleData, setDirectRoleData] = useState(null);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Method 1: Use the RPC function
      console.log('Checking role with RPC for user ID:', user.id);
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_role', {
        user_id: user.id
      });
      
      if (rpcError) {
        console.error('Error checking role with RPC:', rpcError);
        setError(`RPC Error: ${rpcError.message}`);
      } else {
        console.log('Role data from RPC:', rpcData);
        setRoleData(rpcData);
      }
    } catch (err) {
      console.error('Exception checking role with RPC:', err);
      setError(`RPC Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkDirectRole = async () => {
    if (!user) return;

    try {
      // Direct query to profiles table (may trigger recursion)
      console.log('Attempting direct query for user ID:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error with direct query:', error);
        setDirectRoleData(`Error: ${error.message}`);
      } else {
        console.log('Direct query result:', data);
        setDirectRoleData(data?.role || 'none');
      }
    } catch (err) {
      console.error('Exception with direct query:', err);
      setDirectRoleData(`Exception: ${err.message}`);
    }
  };

  const updateToAdmin = async () => {
    if (!user) return;
    
    try {
      // Update the user's role to admin using a direct update
      // This bypasses RLS by using an RPC function
      const { data, error } = await supabase.rpc('set_user_role', {
        user_id: user.id,
        new_role: 'admin'
      });
      
      if (error) {
        console.error('Error updating role:', error);
        alert(`Error updating role: ${error.message}`);
      } else {
        alert('Role updated to admin successfully!');
        checkAdminRole();
      }
    } catch (err) {
      console.error('Exception updating role:', err);
      alert(`Exception updating role: ${err.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-800 border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-300">Admin Role Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="animate-pulse p-4 bg-slate-700 rounded-md">Loading...</div>
        ) : (
          <>
            <div className="p-4 bg-slate-700 rounded-md">
              <h3 className="font-semibold text-purple-300 mb-2">User Info:</h3>
              <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-md">
              <h3 className="font-semibold text-purple-300 mb-2">Role from RPC:</h3>
              {error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <p className="text-lg font-bold">
                  {roleData === 'admin' ? (
                    <span className="text-green-400">✓ Admin</span>
                  ) : (
                    <span className="text-yellow-400">✗ Not Admin ({roleData || 'none'})</span>
                  )}
                </p>
              )}
              <Button 
                onClick={checkAdminRole} 
                className="mt-2 bg-purple-600 hover:bg-purple-700"
              >
                Refresh Role Check
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-md">
              <h3 className="font-semibold text-purple-300 mb-2">Direct Query Check:</h3>
              <p className="mb-2">
                {directRoleData ? (
                  typeof directRoleData === 'string' && directRoleData.startsWith('Error') ? (
                    <span className="text-red-400">{directRoleData}</span>
                  ) : (
                    <span>Role: <strong>{directRoleData}</strong></span>
                  )
                ) : (
                  'Not checked yet'
                )}
              </p>
              <Button 
                onClick={checkDirectRole} 
                variant="outline" 
                className="mt-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Try Direct Query
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700 rounded-md">
              <h3 className="font-semibold text-purple-300 mb-2">Update Role:</h3>
              <Button 
                onClick={updateToAdmin} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Set Role to Admin
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                This will update your user role to 'admin' in the database.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRoleDebug;
