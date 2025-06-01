import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AdminSettingsPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Settings Update Attempted",
      description: "Site settings update functionality will be implemented with Supabase.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="mb-8">
        <Button variant="outline" asChild className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Settings className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-500 to-green-500 mb-6">Site Settings</h1>
          <p className="text-xl text-gray-300">
            Configure global parameters for Your2ndRide. Changes here will affect the entire site.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-slate-800 rounded-xl shadow-2xl">
          <div>
            <Label htmlFor="siteLogoUrl" className="text-gray-300 text-lg">Site Logo URL</Label>
            <Input id="siteLogoUrl" placeholder="https://example.com/logo.png" className="bg-slate-700 border-slate-600 mt-2" />
            <p className="text-xs text-gray-500 mt-1">URL for the main site logo displayed in the navbar.</p>
          </div>

          <div>
            <Label htmlFor="heroImageUrl" className="text-gray-300 text-lg">Homepage Hero Image URL</Label>
            <Input id="heroImageUrl" placeholder="https://example.com/hero-image.jpg" className="bg-slate-700 border-slate-600 mt-2" />
            <p className="text-xs text-gray-500 mt-1">Image for the main banner/hero section on the homepage.</p>
          </div>

          <div>
            <Label htmlFor="heroText" className="text-gray-300 text-lg">Homepage Hero Text</Label>
            <Input id="heroText" placeholder="Find Your Next Dream Ride" className="bg-slate-700 border-slate-600 mt-2" />
            <p className="text-xs text-gray-500 mt-1">Main heading text for the hero section.</p>
          </div>
          
          <div>
            <Label htmlFor="contactEmail" className="text-gray-300 text-lg">Contact Page Email</Label>
            <Input id="contactEmail" type="email" placeholder="support@your2ndride.com" className="bg-slate-700 border-slate-600 mt-2" />
            <p className="text-xs text-gray-500 mt-1">Email address displayed on the contact page.</p>
          </div>

          <div>
            <Label htmlFor="footerCopyright" className="text-gray-300 text-lg">Footer Copyright Text</Label>
            <Input id="footerCopyright" placeholder="© {year} Your2ndRide. All rights reserved." className="bg-slate-700 border-slate-600 mt-2" />
            <p className="text-xs text-gray-500 mt-1">Use {`"{year}"`} for dynamic year.</p>
          </div>

          <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
            Save Settings
          </Button>
          <p className="text-center text-sm text-gray-400">Note: These settings will be stored and retrieved using Supabase once integrated.</p>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSettingsPage;