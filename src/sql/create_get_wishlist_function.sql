-- Create a function to safely get wishlist items without triggering policy recursion
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
