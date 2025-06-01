-- Create a function to safely get a user's role without triggering policy recursion
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
