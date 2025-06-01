import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, Search, UserCog, Shield, Ban, CheckCircle, AlertCircle, RefreshCw, UserX, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // State for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  
  // Fetch profiles using RPC function
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Use the RPC function to avoid recursion issues
        const { data, error } = await supabase.rpc('get_all_profiles');
        
        if (error) throw error;
        
        setUsers(data || []);
        setCount(data?.length || 0);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err);
        toast({
          title: 'Error',
          description: 'Failed to load user profiles',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
    
    // Set up a subscription to refresh data when needed
    const channel = supabase.channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchProfiles();
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [toast]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === '' || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' || 
      user.role === filterRole;
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'admin' && user.role === 'admin') ||
      (activeTab === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole && matchesTab;
  });

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    setIsLoading(true);
    
    try {
      // Use the RPC function to avoid recursion issues
      const { data, error } = await supabase.rpc('set_user_role', {
        user_id: selectedUser.id,
        new_role: newRole
      });
      
      if (error) throw error;
      
      toast({
        title: 'Role Updated',
        description: `User ${selectedUser.full_name || selectedUser.email} is now a ${newRole}.`,
        variant: 'default',
      });
      
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open role change dialog
  const openRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setIsRoleDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8 flex justify-between items-center">
        <Button variant="outline" asChild className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            {count} Total Users
          </Badge>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Users className="mx-auto h-16 w-16 text-purple-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mb-6">User Management</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Manage user accounts, roles, and permissions from this dashboard.
        </p>
      </div>
      
      <Card className="bg-slate-800 border-slate-700 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-400" />
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700" onClick={() => setSearchTerm('')}>
                <RefreshCw size={18} className="mr-2" /> Reset
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-700 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All Users
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600">
                Admins
              </TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-purple-600">
                Regular Users
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderUserTable(filteredUsers, loading, openRoleDialog)}
            </TabsContent>
            
            <TabsContent value="admin" className="mt-0">
              {renderUserTable(filteredUsers, loading, openRoleDialog)}
            </TabsContent>
            
            <TabsContent value="user" className="mt-0">
              {renderUserTable(filteredUsers, loading, openRoleDialog)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="role" className="text-white mb-2 block">Select Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger id="role" className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Cancel
            </Button>
            <Button onClick={handleRoleChange} className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Helper function to render the user table
const renderUserTable = (users, loading, openRoleDialog) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw size={30} className="animate-spin text-purple-500" />
        <span className="ml-4 text-gray-300">Loading users...</span>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <AlertCircle size={40} className="mb-4 text-gray-500" />
        <p>No users found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-700/50">
          <TableRow>
            <TableHead className="text-gray-300">User</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Role</TableHead>
            <TableHead className="text-gray-300">Joined</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
              <TableCell className="font-medium text-white">
                {user.full_name || 'No Name'}
              </TableCell>
              <TableCell className="text-gray-300">
                {user.email || 'No Email'}
              </TableCell>
              <TableCell>
                {user.role === 'admin' ? (
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    <Shield size={14} className="mr-1" /> Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-300 border-gray-500">
                    User
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                {user.created_at 
                  ? new Date(user.created_at).toLocaleDateString() 
                  : 'Unknown'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                    onClick={() => openRoleDialog(user)}
                  >
                    <UserCog size={16} className="mr-1" /> Role
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsersPage;