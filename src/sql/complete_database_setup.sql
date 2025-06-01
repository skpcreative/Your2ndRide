-- Complete Database Setup for Secondhand Vehicle Marketplace
-- This file combines all SQL scripts in the correct order for a fresh installation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets for vehicle photos and documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_photos', 'vehicle_photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_documents', 'vehicle_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create vehicle_listings table
CREATE TABLE IF NOT EXISTS public.vehicle_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  location TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'approved', -- Set default to approved
  images TEXT[], -- Array of image URLs from storage
  documents JSONB, -- Document information
  moderation_notes TEXT, -- Admin notes for rejected listings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vehicle_listings_user_id_idx ON vehicle_listings(user_id);
CREATE INDEX IF NOT EXISTS vehicle_listings_status_idx ON vehicle_listings(status);
CREATE INDEX IF NOT EXISTS vehicle_listings_make_idx ON vehicle_listings(make);
CREATE INDEX IF NOT EXISTS vehicle_listings_year_idx ON vehicle_listings(year);

-- Enable RLS on vehicle_listings
ALTER TABLE public.vehicle_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicle_listings
CREATE POLICY IF NOT EXISTS "Anyone can view approved listings"
ON vehicle_listings FOR SELECT
USING (status = 'approved');

CREATE POLICY IF NOT EXISTS "Users can view their own listings"
ON vehicle_listings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own listings"
ON vehicle_listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own listings"
ON vehicle_listings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own listings"
ON vehicle_listings FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all listings"
ON vehicle_listings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can update all listings"
ON vehicle_listings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can delete all listings"
ON vehicle_listings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicle_listings(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, vehicle_id)
);

-- Enable RLS on wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlists
CREATE POLICY IF NOT EXISTS "Users can view their own wishlist" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert into their own wishlist" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete from their own wishlist" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all wishlists" 
ON public.wishlists 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create helper functions

-- Function to get all vehicle listings without triggering policy recursion
CREATE OR REPLACE FUNCTION get_all_vehicle_listings()
RETURNS SETOF vehicle_listings
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM vehicle_listings;
END;
$$;

-- Function to get user's vehicle listings
CREATE OR REPLACE FUNCTION get_user_vehicle_listings(user_uuid UUID)
RETURNS SETOF vehicle_listings
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM vehicle_listings
  WHERE user_id = user_uuid;
END;
$$;

-- Function to update vehicle listing status
CREATE OR REPLACE FUNCTION update_vehicle_listing_status(listing_id UUID, new_status TEXT, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE vehicle_listings
  SET 
    status = new_status,
    moderation_notes = COALESCE(notes, moderation_notes),
    updated_at = NOW()
  WHERE id = listing_id;
  
  RETURN FOUND;
END;
$$;

-- Function to delete a vehicle listing
CREATE OR REPLACE FUNCTION delete_vehicle_listing(listing_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM vehicle_listings
  WHERE id = listing_id;
  
  RETURN FOUND;
END;
$$;

-- Function to get user profile data
CREATE OR REPLACE FUNCTION get_profile_data(user_uuid UUID)
RETURNS SETOF profiles
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM profiles
  WHERE id = user_uuid;
END;
$$;

-- Function to get all profiles (admin only)
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS SETOF profiles
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM profiles;
END;
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles
  WHERE id = user_uuid;
  
  RETURN user_role;
END;
$$;

-- Function to set user role (admin only)
CREATE OR REPLACE FUNCTION set_user_role(user_uuid UUID, new_role TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles
  SET role = new_role
  WHERE id = user_uuid;
  
  RETURN FOUND;
END;
$$;

-- Function to get user's wishlist
CREATE OR REPLACE FUNCTION get_wishlist(user_uuid UUID)
RETURNS TABLE (
  wishlist_id UUID,
  vehicle_id UUID,
  title TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  price DECIMAL(10, 2),
  image TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT w.id as wishlist_id, v.id as vehicle_id, v.title, v.make, v.model, v.year, v.price, 
         (v.images)[1] as image
  FROM wishlists w
  JOIN vehicle_listings v ON w.vehicle_id = v.id
  WHERE w.user_id = user_uuid;
END;
$$;

-- Function to delete wishlist item
CREATE OR REPLACE FUNCTION delete_wishlist_item(wishlist_item_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM wishlists
  WHERE id = wishlist_item_id;
  
  RETURN FOUND;
END;
$$;

-- Update all existing listings to 'approved' status
UPDATE vehicle_listings
SET status = 'approved'
WHERE status = 'pending';

-- Set default value for status column to 'approved'
ALTER TABLE vehicle_listings
ALTER COLUMN status SET DEFAULT 'approved';

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_listings_modtime
BEFORE UPDATE ON vehicle_listings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
