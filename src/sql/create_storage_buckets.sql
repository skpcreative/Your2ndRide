-- Create storage buckets for vehicle photos and documents

-- First, create the vehicle_photos bucket (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_photos', 'vehicle_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for vehicle_photos bucket
-- Allow anyone to read photos (they're public)
CREATE POLICY "Public Access Vehicle Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle_photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated Users Can Upload Vehicle Photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own photos
CREATE POLICY "Users Can Update Their Own Vehicle Photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own photos
CREATE POLICY "Users Can Delete Their Own Vehicle Photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Next, create the vehicle_documents bucket (private access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_documents', 'vehicle_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for vehicle_documents bucket
-- Allow users to read only their own documents
CREATE POLICY "Users Can Read Their Own Vehicle Documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'vehicle_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated Users Can Upload Vehicle Documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own documents
CREATE POLICY "Users Can Update Their Own Vehicle Documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own documents
CREATE POLICY "Users Can Delete Their Own Vehicle Documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to access all documents
CREATE POLICY "Admins Can Access All Vehicle Documents"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'vehicle_documents' AND 
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
