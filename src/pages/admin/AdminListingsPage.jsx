import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Using Input instead of Textarea since it's available
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ListChecks, Search, CheckCircle, XCircle, Eye, AlertCircle, RefreshCw, Filter, Car, Clock, DollarSign, Trash2, FileText, FileX, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
// Simple toast implementation
const toast = ({ title, description }) => {
  console.log(`Toast: ${title} - ${description}`);
  alert(`${title}: ${description}`);
};

const AdminListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // State for listings data
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Function to update all listings to approved status
  const updateAllListingsToApproved = async () => {
    try {
      const { error } = await supabase
        .from('vehicle_listings')
        .update({ status: 'approved' })
        .eq('status', 'pending');
      
      if (error) throw error;
      console.log('All pending listings updated to approved status');
    } catch (err) {
      console.error('Error updating listings status:', err);
    }
  };
  
  // Fetch listings directly from Supabase
  useEffect(() => {
    // First update all listings to approved status
    updateAllListingsToApproved().then(() => {
      // Then fetch the updated listings
      fetchListings();
    });
    
    const fetchListings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicle_listings')
          .select('*');
        
        if (error) throw error;
        
        console.log('Fetched listings:', data);
        setListings(data || []);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('vehicle_listings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicle_listings' }, (payload) => {
        console.log('Real-time update:', payload);
        fetchListings(); // Refetch on any change
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Filter listings based on search term and whether they have documents
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      searchTerm === '' || 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      listing.make?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      listing.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'with_documents' && listing.documents && Array.isArray(listing.documents) && listing.documents.length > 0);
    
    return matchesSearch && matchesTab;
  });

  // Add document notes
  const handleAddVerificationNote = async () => {
    if (!selectedListing) return;
    
    try {
      setIsLoading(true);
      
      // Add document notes
      const { error } = await supabase
        .from('vehicle_listings')
        .update({
          moderation_notes: verificationNotes || null
        })
        .eq('id', selectedListing.id);
      
      if (error) throw error;
      
      toast({
        title: "Notes Saved",
        description: "Document notes have been saved successfully."
      });
      
      setVerificationNotes('');
      setIsVerificationDialogOpen(false);
      
    } catch (error) {
      console.error('Error adding document notes:', error);
      toast({
        title: "Error",
        description: "Failed to save document notes. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle listing deletion
  const handleDeleteListing = async () => {
    if (!selectedListing) {
      console.log('No listing selected for deletion');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('vehicle_listings')
        .delete()
        .eq('id', selectedListing.id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      toast({
        title: 'Listing Deleted',
        description: `The listing "${selectedListing.title}" has been permanently deleted.`
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: 'Error',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open view dialog
  const openViewDialog = (listing) => {
    setSelectedListing(listing);
    setIsViewDialogOpen(true);
  };

  // Open verification dialog
  const openVerificationDialog = (listing) => {
    setSelectedListing(listing);
    setIsVerificationDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (listing) => {
    setSelectedListing(listing);
    setIsDeleteDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return (
      <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
        <CheckCircle className="w-3 h-3 mr-1" /> Active
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Vehicle Listings Overview</h1>
        <Button asChild variant="outline" className="text-gray-300 border-gray-600">
          <Link to="/admin">
            <ArrowLeft size={16} className="mr-2" /> Back to Admin
          </Link>
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <ListChecks className="mx-auto h-16 w-16 text-pink-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 mb-6">Listing Management</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Review, approve, or reject vehicle listings from this dashboard.
        </p>
      </div>
      
      <Card className="bg-slate-800 border-slate-700 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700" onClick={() => setSearchTerm('')}>
                <RefreshCw size={18} className="mr-2" /> Reset
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-pink-600">
                All Listings
              </TabsTrigger>
              <TabsTrigger value="with_documents" className="data-[state=active]:bg-pink-600">
                With Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderListingTable(filteredListings, loading, openViewDialog, openVerificationDialog, getStatusBadge)}
            </TabsContent>
            
            <TabsContent value="with_documents" className="mt-0">
              {renderListingTable(
                filteredListings.filter(listing => listing.documents && listing.documents.length > 0),
                loading,
                openViewDialog,
                openVerificationDialog,
                getStatusBadge
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedListing?.title || 'Vehicle Details'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ID: {selectedListing?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedListing && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Make:</span> {selectedListing.make}</p>
                    <p><span className="text-gray-400">Model:</span> {selectedListing.model}</p>
                    <p><span className="text-gray-400">Year:</span> {selectedListing.year}</p>
                    <p><span className="text-gray-400">Mileage:</span> {selectedListing.mileage?.toLocaleString() || 'N/A'} miles</p>
                    <p><span className="text-gray-400">Price:</span> ₹{selectedListing.price?.toLocaleString() || 'N/A'}</p>
                    <p><span className="text-gray-400">Phone:</span> {selectedListing.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Seller ID:</span> {selectedListing.user_id}</p>
                    <p><span className="text-gray-400">Location:</span> {selectedListing.location || 'Not specified'}</p>
                    <p><span className="text-gray-400">Listed on:</span> {new Date(selectedListing.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedListing.description || 'No description provided.'}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Images</h3>
                {selectedListing.images && selectedListing.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedListing.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Vehicle image ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No images available</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                {selectedListing.documents && selectedListing.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedListing.documents.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-slate-700 rounded-md">
                        <FileText className="text-blue-400 mr-2" size={20} />
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Document {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No documents available</p>
                )}
              </div>
              
              {selectedListing.documents && selectedListing.documents.length > 0 && (
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      openVerificationDialog(selectedListing);
                    }}
                  >
                    <FileText size={16} className="mr-2" /> Add Document Notes
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Close
            </Button>
            
            {selectedListing && selectedListing.status === 'pending' && (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-900/30"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openDeleteDialog(selectedListing);
                  }}
                >
                  <XCircle size={16} className="mr-2" /> Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openVerificationDialog(selectedListing);
                  }}
                >
                  <CheckCircle size={16} className="mr-2" /> Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Document Notes</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add notes about the documents submitted by the seller.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="verification-notes" className="text-gray-300 mb-2 block">
              Document Notes
            </Label>
            <Input 
              id="verification-notes" 
              placeholder="Enter notes about the seller's documents..."
              className="bg-slate-700 border-slate-600 text-white"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddVerificationNote}>
              <FileText size={16} className="mr-2" /> Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500">
              Delete Listing
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to permanently delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedListing && (
            <div className="py-4 border-y border-slate-700 my-2">
              <h3 className="font-medium text-white mb-2">{selectedListing.title}</h3>
              <div className="text-sm text-gray-400">
                <p>Make: {selectedListing.make}</p>
                <p>Model: {selectedListing.model}</p>
                <p>Year: {selectedListing.year}</p>
                <p>Price: ₹{selectedListing.price?.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteListing}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Helper function to render the listing table
const renderListingTable = (listings, loading, openViewDialog, openVerificationDialog, getStatusBadge) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-pink-500" />
        <p className="text-gray-400 mt-2">Loading listings...</p>
      </div>
    );
  }
  
  if (listings.length === 0) {
    return (
      <div className="text-center py-10">
        <FileX className="h-16 w-16 mx-auto text-gray-500" />
        <p className="text-gray-400 mt-2">No listings found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-700/50">
          <TableRow>
            <TableHead className="text-gray-300">Title</TableHead>
            <TableHead className="text-gray-300">Seller</TableHead>
            <TableHead className="text-gray-300">Price</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Documents</TableHead>
            <TableHead className="text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map(listing => (
            <TableRow key={listing.id} className="border-slate-700 hover:bg-slate-700/30">
              <TableCell className="font-medium text-white">
                {listing.title || 'Untitled'}
                <div className="text-xs text-gray-400">{listing.make} {listing.model} ({listing.year})</div>
              </TableCell>
              <TableCell className="text-gray-300">
                {listing.user_id || 'Unknown'}
              </TableCell>
              <TableCell className="text-gray-300">
                <div className="flex items-center">
                  <DollarSign size={14} className="text-green-400 mr-1" />
                  {listing.price?.toLocaleString() || 'N/A'}
                </div>
              </TableCell>
              <TableCell className="text-gray-300">
                {new Date(listing.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {listing.documents && Array.isArray(listing.documents) && listing.documents.length > 0 ? (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                    <FileText className="w-3 h-3 mr-1" /> {listing.documents.length} Document(s)
                  </Badge>
                ) : (
                  <Badge className="bg-slate-600 hover:bg-slate-700 text-white border-0">
                    <FileX className="w-3 h-3 mr-1" /> No Documents
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                    onClick={() => openViewDialog(listing)}
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                  
                  {listing.documents && Array.isArray(listing.documents) && listing.documents.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openVerificationDialog(listing)}
                      className="h-8 w-8 text-blue-400 hover:text-white hover:bg-blue-600"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-900/30"
                    onClick={() => openDeleteDialog(listing)}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
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

export default AdminListingsPage;