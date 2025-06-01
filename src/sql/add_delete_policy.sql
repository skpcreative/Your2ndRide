-- Add policy to allow admins to delete any listing
CREATE POLICY "Admins can delete all listings" 
ON public.vehicle_listings 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add policy to allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON public.vehicle_listings 
FOR DELETE 
USING (auth.uid() = user_id);
