-- Create a function to safely get vehicle listings without triggering policy recursion
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
