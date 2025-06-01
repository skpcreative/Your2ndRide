import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import SellPage from '@/pages/SellPage';
import BuyPage from '@/pages/BuyPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import WishlistPage from '@/pages/WishlistPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import ChatPage from '@/pages/ChatPage';
import { NotificationProvider } from '@/context/NotificationContext';
import ListingDetailPage from '@/pages/ListingDetailPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminListingsPage from '@/pages/admin/AdminListingsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminBansPage from '@/pages/admin/AdminBansPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <NotificationProvider>
      <Router>
        <MainLayout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
              <Route path="/buy" element={<AnimatedPage><BuyPage /></AnimatedPage>} />
              <Route path="/listing/:id" element={<AnimatedPage><ListingDetailPage /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
              <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
              
              {/* Authentication routes - redirect if already logged in */}
              <Route 
                path="/login" 
                element={
                  loading ? (
                    <div className="flex items-center justify-center h-screen">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <AnimatedPage><LoginPage /></AnimatedPage>
                  )
                } 
              />
              <Route 
                path="/register" 
                element={
                  loading ? (
                    <div className="flex items-center justify-center h-screen">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <AnimatedPage><RegisterPage /></AnimatedPage>
                  )
                } 
              />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/sell" element={<AnimatedPage><SellPage /></AnimatedPage>} />
                <Route path="/wishlist" element={<AnimatedPage><WishlistPage /></AnimatedPage>} />
                <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
                <Route path="/chat" element={<AnimatedPage><ChatPage /></AnimatedPage>} />
              </Route>
              
              {/* Admin routes - require authentication and admin role */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
                <Route path="/admin/users" element={<AnimatedPage><AdminUsersPage /></AnimatedPage>} />
                <Route path="/admin/listings" element={<AnimatedPage><AdminListingsPage /></AnimatedPage>} />
                <Route path="/admin/reports" element={<AnimatedPage><AdminReportsPage /></AnimatedPage>} />
                <Route path="/admin/bans" element={<AnimatedPage><AdminBansPage /></AnimatedPage>} />
                <Route path="/admin/settings" element={<AnimatedPage><AdminSettingsPage /></AnimatedPage>} />
                <Route path="/admin/analytics" element={<AnimatedPage><AdminAnalyticsPage /></AnimatedPage>} />
                <Route path="/admin/chat" element={<AnimatedPage><AdminChatPage /></AnimatedPage>} />
              </Route>
              
              <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      </Router>
    </NotificationProvider>
  );
}

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;