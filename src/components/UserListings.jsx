import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useUserVehicleListings } from '@/hooks/useVehicleListings';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500'
};

const UserListings = () => {
  const { userListings, loading, error } = useUserVehicleListings();
  const { toast } = useToast();

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const { error } = await supabase.rpc('delete_vehicle_listing', {
        listing_id_param: id,
        user_id_param: supabase.auth.getUser().then(({ data }) => data.user.id)
      });
      
      if (error) throw error;
      
      toast({
        title: 'Listing Deleted',
        description: 'Your listing has been successfully deleted.'
      });
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete listing. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your listings...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading listings. Please try again.
      </div>
    );
  }

  if (userListings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">You don't have any vehicle listings yet.</p>
        <Button asChild>
          <Link to="/sell">Create Your First Listing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-purple-300">Your Vehicle Listings</h3>
        <Button asChild variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
          <Link to="/sell">+ Add New Listing</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userListings.map((listing) => (
          <Card key={listing.id} className="bg-slate-800 border-slate-700 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              {listing.images && listing.images[0] ? (
                <img 
                  src={listing.images[0]} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <p className="text-slate-500">No Image</p>
                </div>
              )}
              <Badge 
                className={`absolute top-2 right-2 ${statusColors[listing.status] || 'bg-slate-500'}`}
              >
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">{listing.title}</CardTitle>
              <CardDescription>
                ${listing.price.toLocaleString()} • {listing.location || 'Location not specified'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <p className="text-sm text-slate-400 line-clamp-2">
                {listing.description || 'No description provided.'}
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/listing/${listing.id}`}>
                  <Eye className="mr-1 h-4 w-4" /> View
                </Link>
              </Button>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/edit-listing/${listing.id}`}>
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserListings;
