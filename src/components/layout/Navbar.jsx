import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Car, ShoppingCart, UserCircle, LogIn, Settings, UserPlus, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { supabase } from '@/lib/supabaseClient';
import LogoutButton from '@/components/LogoutButton';
import { Badge } from '@/components/ui/badge';
import { ChatNotifications } from '@/components/chat/ChatNotifications';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const { unreadCount } = useNotification();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the current user has admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
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
          return;
        }
        
        console.log('User role data:', data);
        setIsAdmin(data === 'admin');
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminRole();
  }, [user]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Buy', path: '/buy' },
    { name: 'Sell', path: '/sell' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const userNavItems = [
    { name: 'Wishlist', path: '/wishlist', icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { 
      name: 'Chat', 
      path: '/chat', 
      icon: (
        <div className="relative">
          <MessageCircle className="w-5 h-5 mr-2" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
      ) 
    },
    { name: 'Profile', path: '/profile', icon: <UserCircle className="w-5 h-5 mr-2" /> },
  ];
  
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  // No longer needed as we're using the real auth context

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
            <Car className="w-8 h-8 text-purple-400" />
            <span>Your2ndRide</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
                    isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-purple-500 hover:text-white hover:shadow-sm'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                {userNavItems.map((item) => (
                  <NavLink key={item.name} to={item.path} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center ${ isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-purple-500 hover:text-white hover:shadow-sm'}`}>
                    {item.icon} {item.name}
                  </NavLink>
                ))}
                {/* Only show admin link if user has admin role */}
                {isAdmin && (
                  <NavLink to="/admin" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out flex items-center ${ isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-purple-500 hover:text-white hover:shadow-sm'}`}>
                    <Settings className="w-5 h-5 mr-2" /> Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <ChatNotifications />
                <LogoutButton className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" />
              </>
            ) : loading ? (
              <div className="animate-pulse w-24 h-10 bg-slate-700 rounded-md"></div>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-300 hover:bg-purple-500 hover:text-white">
                  <Link to="/login">
                    <LogIn className="w-5 h-5 mr-2" /> Login
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Link to="/register">
                    <UserPlus className="w-5 h-5 mr-2" /> Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-slate-800/95 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out ${
                      isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-purple-500 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  {userNavItems.map((item) => (
                    <NavLink key={item.name} to={item.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out flex items-center ${ isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-purple-500 hover:text-white'}`}>
                      {item.icon} {item.name}
                    </NavLink>
                  ))}
                  {isAdmin && (
                    <NavLink to="/admin" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out flex items-center ${ isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-purple-500 hover:text-white'}`}>
                      <Settings className="w-5 h-5 mr-2" /> Admin
                    </NavLink>
                  )}
                </>
              )}
              <div className="pt-4 pb-2 border-t border-slate-700">
                {isAuthenticated ? (
                  <LogoutButton 
                    className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" 
                    onClick={() => setIsOpen(false)}
                  />
                ) : loading ? (
                  <div className="animate-pulse w-full h-10 bg-slate-700 rounded-md"></div>
                ) : (
                  <div className="space-y-2">
                    <Button asChild onClick={() => setIsOpen(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Link to="/login">
                        <LogIn className="w-5 h-5 mr-2" /> Login
                      </Link>
                    </Button>
                    <Button asChild onClick={() => setIsOpen(false)} variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                       <Link to="/register">
                        <UserPlus className="w-5 h-5 mr-2" /> Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;