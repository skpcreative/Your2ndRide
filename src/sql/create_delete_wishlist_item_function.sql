-- Create a function to safely delete a wishlist item without triggering policy recursion
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
