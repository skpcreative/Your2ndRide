-- Create a function to safely set a user's role without triggering policy recursion
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
