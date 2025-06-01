-- Create a function to safely get a user's profile data without triggering policy recursion
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
