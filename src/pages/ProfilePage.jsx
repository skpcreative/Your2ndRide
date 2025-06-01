import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { UserCircle, Edit3, Shield, Bell, Car, MessageSquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import LogoutButton from '@/components/LogoutButton';
import UserListings from '@/components/UserListings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Default values for user profile
const defaultProfileData = {
  full_name: "",
  avatar_url: "",
  listingsCount: 0,
  messagesCount: 0,
};

const ProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // First, try to get the profile data directly using a function call to avoid recursion
        const { data: profileResult, error: profileError } = await supabase.rpc('get_profile_data', {
          user_id: user.id
        });
        
        // Get the active listings count
        const { count: listingsCount, error: listingsError } = await supabase
          .from('vehicle_listings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'approved');
        
        if (listingsError) {
          console.error('Error fetching listings count:', listingsError);
        }
        
        if (profileError) {
          console.error('Error fetching profile with RPC:', profileError);
          
          // Fallback: Try to get user metadata from auth.users
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
          
          if (userError) {
            throw userError;
          }
          
          // Use data from auth user metadata if available
          setFormData({
            full_name: userData?.user?.user_metadata?.full_name || '',
            avatar_url: '',
          });
          
          // Set profile data with listings count
          setProfileData({
            ...defaultProfileData,
            listingsCount: listingsCount || 0,
          });
          
          return;
        }

        // If profile data exists from the RPC call, use it
        if (profileResult) {
          setProfileData({
            ...defaultProfileData,
            ...profileResult,
            listingsCount: listingsCount || 0, // Update with actual count
          });
          
          setFormData({
            full_name: profileResult.full_name || user.user_metadata?.full_name || '',
            avatar_url: profileResult.avatar_url || '',
          });
        } else {
          // Use data from auth user metadata if available
          setFormData({
            full_name: user.user_metadata?.full_name || '',
            avatar_url: '',
          });
          
          // Set profile data with listings count
          setProfileData({
            ...defaultProfileData,
            listingsCount: listingsCount || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive',
        });
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...formData
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <Card className="w-full max-w-3xl mx-auto bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="text-center relative">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-slate-800 shadow-lg">
              <img className="w-28 h-28 rounded-full object-cover" alt={formData.full_name || 'Profile Picture'} src={formData.avatar_url || "https://images.unsplash.com/photo-1697256200022-f61abccad430"} />
            </div>
          </motion.div>
          <div className="pt-20"> {/* Added padding to push content below avatar */}
            <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
              {formData.full_name || 'Your Name'}
            </CardTitle>
            <CardDescription className="text-gray-400">{user?.email || 'Loading...'} | Joined: {user ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <Car className="mx-auto h-8 w-8 text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{profileData.listingsCount}</p>
              <p className="text-sm text-gray-400">Active Listings</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <MessageSquare className="mx-auto h-8 w-8 text-pink-400 mb-2" />
              <p className="text-2xl font-bold">{profileData.messagesCount}</p>
              <p className="text-sm text-gray-400">Unread Messages</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h3 className="text-xl font-semibold text-purple-300 border-b border-slate-700 pb-2">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input 
                  id="full_name" 
                  type="text" 
                  value={formData.full_name} 
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 placeholder-slate-500" 
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email (Cannot be changed)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ''} 
                  readOnly 
                  className="bg-slate-700 border-slate-600 placeholder-slate-500 opacity-70 cursor-not-allowed" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="profilePicture" className="text-gray-300">Profile Picture URL</Label>
              <Input 
                id="avatar_url" 
                type="text" 
                value={formData.avatar_url} 
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg" 
                className="bg-slate-700 border-slate-600 placeholder-slate-500" 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading}
            >
              <Edit3 className="mr-2 h-4 w-4" /> {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>

          <Tabs defaultValue="listings" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="listings" className="data-[state=active]:bg-slate-800">Your Listings</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-slate-800">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="mt-6">
              <UserListings />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300 border-b border-slate-700 pb-2">Account Settings</h3>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left border-slate-600 hover:bg-slate-700 hover:text-purple-300">
                  <Shield className="mr-2 h-4 w-4 text-green-400" /> Change Password
                </Button>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left border-slate-600 hover:bg-slate-700 hover:text-purple-300">
                  <Bell className="mr-2 h-4 w-4 text-yellow-400" /> Notification Preferences
                </Button>
                <LogoutButton variant="destructive" className="w-full md:w-auto" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;