import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { UserPlus, Mail, KeyRound, User, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
        variant: "default",
      });
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast({
        title: "Registration Failed",
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
      className="flex items-center justify-center py-12"
    >
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}>
            <UserPlus className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          </motion.div>
          <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">Create an Account</CardTitle>
          <CardDescription className="text-gray-400">Join Your2ndRide today!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-purple-400" /> Full Name
              </Label>
              <Input 
                id="fullName" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-700 border-slate-600 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-400" /> Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center">
                <KeyRound className="w-4 h-4 mr-2 text-purple-400" /> Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center">
                <KeyRound className="w-4 h-4 mr-2 text-purple-400" /> Confirm Password
              </Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;