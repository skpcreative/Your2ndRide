-- =============================================
-- CONSOLIDATED SQL FILE TO FIX RECURSION ISSUES
-- =============================================
-- This file contains all the functions needed to fix infinite recursion issues
-- in the secondhand vehicle marketplace application.
-- Execute this entire file in your Supabase SQL Editor.

-- ---------------------------------------------
-- 1. Function to safely get a user's role
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Directly query the profiles table bypassing RLS policies
  SELECT role INTO user_role FROM profiles WHERE id = user_id;
  RETURN user_role;
END;
$$;

-- ---------------------------------------------
-- 2. Function to safely set a user's role
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION set_user_role(user_id UUID, new_role TEXT)
RETURNS BOOLEAN
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Update the user's role directly, bypassing RLS policies
  UPDATE profiles 
  SET role = new_role
  WHERE id = user_id;
  
  -- Check if the update was successful
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- ---------------------------------------------
-- 3. Function to safely get a user's profile data
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION get_profile_data(user_id UUID)
RETURNS JSON
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  profile_data JSON;
BEGIN
  -- Directly query the profiles table bypassing RLS policies
  SELECT row_to_json(p) INTO profile_data 
  FROM profiles p 
  WHERE id = user_id;
  
  RETURN profile_data;
END;
$$;

-- ---------------------------------------------
-- 4. Function to safely get vehicle listings
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION get_vehicle_listings(status_filter TEXT)
RETURNS SETOF vehicle_listings
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Directly query the vehicle_listings table bypassing RLS policies
  RETURN QUERY
  SELECT * FROM vehicle_listings
  WHERE status = status_filter;
END;
$$;

-- ---------------------------------------------
-- 5. Function to safely get wishlist items
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION get_user_wishlist(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  vehicle_id UUID,
  created_at TIMESTAMPTZ,
  vehicle_data JSONB
)
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.user_id,
    w.vehicle_id,
    w.created_at,
    to_jsonb(v) as vehicle_data
  FROM 
    wishlists w
  LEFT JOIN 
    vehicle_listings v ON w.vehicle_id = v.id
  WHERE 
    w.user_id = user_id_param
    AND v.status = 'approved';
END;
$$;

-- ---------------------------------------------
-- 6. Function to safely delete a wishlist item
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION delete_wishlist_item(wishlist_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Delete the wishlist item directly, bypassing RLS policies
  DELETE FROM wishlists 
  WHERE id = wishlist_id_param AND user_id = user_id_param;
  
  -- Check if the delete was successful
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- ---------------------------------------------
-- 7. Function to safely add a wishlist item
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION add_wishlist_item(user_id_param UUID, vehicle_id_param UUID)
RETURNS UUID
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert the wishlist item directly, bypassing RLS policies
  INSERT INTO wishlists (user_id, vehicle_id, created_at)
  VALUES (user_id_param, vehicle_id_param, NOW())
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- ---------------------------------------------
-- 8. Function to safely get all user profiles for admin page
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS SETOF profiles
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Directly query the profiles table bypassing RLS policies
  RETURN QUERY
  SELECT * FROM profiles
  ORDER BY created_at DESC;
END;
$$;

-- =============================================
-- END OF FILE
-- =============================================
