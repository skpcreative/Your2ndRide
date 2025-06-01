-- Create a function to safely get all user profiles without triggering policy recursion
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
