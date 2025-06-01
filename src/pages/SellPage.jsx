import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Camera, FileText, DollarSign, ArrowRight, ArrowLeft, Loader2, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { uploadVehicleImages, uploadVehicleDocuments } from '@/utils/vehicleStorage';
import { supabase } from '@/lib/supabaseClient';

const SellPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
    location: '',
    phone: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const sectionTitleStyle = "text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500";
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs for the images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };
  
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newPreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up the URL
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };
  
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(files);
  };
  
  const validateCurrentStep = () => {
    switch(step) {
      case 1:
        // Validate vehicle details
        if (!formData.make || !formData.model || !formData.year) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        // Validate photos & description
        if (!formData.description) {
          toast({
            title: "Missing Description",
            description: "Please provide a description of your vehicle",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        // Validate price
        if (!formData.price) {
          toast({
            title: "Missing Price",
            description: "Please provide an asking price for your vehicle",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a listing",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Process images if any
      let imageUrls = [];
      let documentUrls = [];
      
      // Show loading toast for upload
      toast({
        title: "Uploading Files",
        description: "Please wait while we upload your images and documents...",
      });
      
      // Upload images to Supabase Storage
      if (imageFiles.length > 0) {
        try {
          imageUrls = await uploadVehicleImages(imageFiles, user.id);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          toast({
            title: "Image Upload Failed",
            description: "There was an error uploading your images.",
            variant: "destructive"
          });
        }
      }
      
      // Upload documents to Supabase Storage
      if (documentFiles.length > 0) {
        try {
          documentUrls = await uploadVehicleDocuments(documentFiles, user.id);
        } catch (uploadError) {
          console.error('Error uploading documents:', uploadError);
          toast({
            title: "Document Upload Failed",
            description: "There was an error uploading your documents.",
            variant: "destructive"
          });
        }
      }
      
      // Prepare listing data - extract specific fields to avoid schema issues
      const listingData = {
        user_id: user.id,
        title: `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        images: imageUrls,
        documents: documentUrls,
        status: 'approved' // Auto-approve listings
      };
      
      // Insert the listing into the database
      const { data, error: insertError } = await supabase
        .from('vehicle_listings')
        .insert(listingData)
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: "Listing Submitted",
        description: "Your vehicle listing has been submitted for review"
      });
      
      // Set success state to show success message
      setSuccess(true);
      
      // Redirect to user's listings page or home after a delay
      setTimeout(() => {
        navigate('/profile');
      }, 5000);
    } catch (err) {
      console.error('Error submitting listing:', err);
      setError(err);
      toast({
        title: "Submission Failed",
        description: err.message || "There was a problem submitting your listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 bg-slate-800 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-white">Sell Your Vehicle</h1>
        <div className="text-center py-16">
          <div className="text-yellow-500 text-5xl mb-4">🔒</div>
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">Please log in to create a vehicle listing</p>
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }
  
  // If listing was successfully submitted
  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 bg-slate-800 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-white">Listing Submitted</h1>
        <div className="text-center py-16">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">Thank You!</h2>
          <p className="text-gray-400 mb-8">Your vehicle listing has been submitted for review. We'll notify you once it's approved.</p>
          <Button 
            onClick={() => navigate('/profile')}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            View My Listings
          </Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
            <h2 className={sectionTitleStyle}><Car className="inline-block mr-2 mb-1" />Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="make">Make <span className="text-red-500">*</span></Label>
                <Input 
                  id="make" 
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                <Input 
                  id="model" 
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input 
                  id="mileage" 
                  type="number" 
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="e.g., 25000" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                />
              </div>
            </div>
            <p className="text-sm text-gray-400">Provide accurate details about your vehicle. Fields marked with <span className="text-red-500">*</span> are required.</p>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
            <h2 className={sectionTitleStyle}><Camera className="inline-block mr-2 mb-1" />Photos & Description</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="images" className="text-white">Upload Photos</Label>
                <Input 
                  id="images" 
                  type="file" 
                  multiple 
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="bg-slate-700 border-slate-600 file:text-purple-300 file:bg-slate-600 file:border-0" 
                />
                
                {imagePreviewUrls && imagePreviewUrls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-400">
                    No images selected. Add photos to attract more buyers.
                  </div>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <textarea 
                  id="description" 
                  rows="5" 
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your vehicle's condition, features, etc." 
                  className="w-full p-2 rounded-md bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500"
                  required
                ></textarea>
              </div>
              <p className="text-sm text-gray-400">High-quality photos and a detailed description attract more buyers. Fields marked with <span className="text-red-500">*</span> are required.</p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
            <h2 className={sectionTitleStyle}><DollarSign className="inline-block mr-2 mb-1" />Contact & Price</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="price">Asking Price (₹) <span className="text-red-500">*</span></Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 15000" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number" 
                  className="bg-slate-700 border-slate-600 placeholder-slate-400" 
                />
              </div>
            </div>
            <p className="text-sm text-gray-400">Set your price and how buyers can reach you. In-app chat is always available. Fields marked with <span className="text-red-500">*</span> are required.</p>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
            <h2 className={sectionTitleStyle}><FileText className="inline-block mr-2 mb-1" />Document Verification</h2>
            <div className="mb-6">
              <Label htmlFor="documents">Upload Vehicle Documents (e.g., Title, Registration)</Label>
              <Input 
                id="documents" 
                type="file" 
                multiple 
                onChange={handleDocumentUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                className="bg-slate-700 border-slate-600 file:text-purple-300 file:bg-slate-600 file:border-0" 
              />
              {documentFiles.length > 0 && (
                <div className="mt-2 text-sm text-green-400">
                  {documentFiles.length} {documentFiles.length === 1 ? 'document' : 'documents'} selected
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">Upload necessary documents for verification. This builds trust with buyers.</p>
            <Button 
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Listing for Review'
              )}
            </Button>
            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
                {error.message || 'An error occurred while submitting your listing. Please try again.'}
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  const stepsIndicator = [
    { icon: <Car/>, name: "Details" },
    { icon: <Camera/>, name: "Media" },
    { icon: <DollarSign/>, name: "Price" },
    { icon: <FileText/>, name: "Docs" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-slate-800 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-white">Sell Your Vehicle</h1>
      <p className="text-center text-gray-300 mb-10">Follow these simple steps to list your vehicle on Your2ndRide.</p>

      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-12">
        {stepsIndicator.map((s, index) => (
          <React.Fragment key={s.name}>
            <div className={`flex flex-col items-center ${step > index ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step > index ? 'bg-purple-500 border-purple-500 text-white' : step === index + 1 ? 'border-purple-500 text-purple-400' : 'border-gray-600'}`}>
                {React.cloneElement(s.icon, { className: "w-5 h-5"})}
              </div>
              <span className={`mt-2 text-xs font-medium ${step >= index + 1 ? 'text-purple-300' : 'text-gray-400'}`}>{s.name}</span>
            </div>
            {index < stepsIndicator.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="min-h-[300px] overflow-hidden relative"> {/* Ensure consistent height and hide overflow for transitions */}
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-12">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={step === 1 || loading} 
          className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white disabled:opacity-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {step < 4 ? (
          <Button 
            onClick={nextStep} 
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <span></span> // Placeholder for submit button which is inside step 4
        )}
      </div>
    </div>
  );
};

export default SellPage;
