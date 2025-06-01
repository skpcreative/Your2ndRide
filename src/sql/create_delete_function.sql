-- Create a database function to delete vehicle listings
-- This function will bypass RLS and allow admins to delete any listing
CREATE OR REPLACE FUNCTION public.delete_vehicle_listing(listing_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
DECLARE
  is_admin BOOLEAN;
  listing_exists BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) INTO is_admin;
  
  -- Check if the listing exists
  SELECT EXISTS (
    SELECT 1 FROM vehicle_listings 
    WHERE id = listing_id
  ) INTO listing_exists;
  
  -- Only proceed if the listing exists
  IF NOT listing_exists THEN
    RETURN FALSE;
  END IF;
  
  -- If user is admin or owns the listing, delete it
  IF is_admin OR EXISTS (
    SELECT 1 FROM vehicle_listings 
    WHERE id = listing_id 
    AND user_id = auth.uid()
  ) THEN
    DELETE FROM vehicle_listings WHERE id = listing_id;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;
