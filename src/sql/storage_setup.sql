-- Create the vehicle-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true);

-- Set up security policies for the vehicle-images bucket

-- Allow anyone to read images (since they're public)
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update and delete their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vehicle-images'
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vehicle-images'
  AND auth.uid() = owner
);

-- Allow admins to manage all images
CREATE POLICY "Admins can manage all images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
