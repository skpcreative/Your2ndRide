import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className, onClick }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    // Call the onClick prop if provided
    if (onClick) onClick();
    
    try {
      await signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        variant: 'default',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was a problem logging you out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="ghost" 
      className={className || "text-gray-300 hover:text-white hover:bg-slate-700"}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;
