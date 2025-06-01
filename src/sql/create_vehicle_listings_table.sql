-- Create vehicle_listings table with proper structure
CREATE TABLE IF NOT EXISTS vehicle_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  images JSONB, -- Array of image URLs from storage
  documents JSONB, -- Array of document URLs from storage
  moderation_notes TEXT, -- Admin notes for rejected listings
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vehicle_listings_user_id_idx ON vehicle_listings(user_id);
CREATE INDEX IF NOT EXISTS vehicle_listings_status_idx ON vehicle_listings(status);
CREATE INDEX IF NOT EXISTS vehicle_listings_make_idx ON vehicle_listings(make);
CREATE INDEX IF NOT EXISTS vehicle_listings_year_idx ON vehicle_listings(year);

-- Create storage buckets for vehicle photos and documents
-- Note: This assumes you're running this in Supabase which supports this syntax
-- If not, you'll need to create these buckets through the Supabase UI or API

-- Create vehicle_photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_photos', 'vehicle_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create vehicle_documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle_documents', 'vehicle_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for vehicle_listings table
ALTER TABLE vehicle_listings ENABLE ROW LEVEL SECURITY;

-- Allow users to view approved listings
CREATE POLICY "Anyone can view approved listings"
ON vehicle_listings FOR SELECT
USING (status = 'approved');

-- Allow users to view their own listings regardless of status
CREATE POLICY "Users can view their own listings"
ON vehicle_listings FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own listings
CREATE POLICY "Users can create their own listings"
ON vehicle_listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings if not approved/rejected
CREATE POLICY "Users can update their own pending listings"
ON vehicle_listings FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own listings if not approved
CREATE POLICY "Users can delete their own pending listings"
ON vehicle_listings FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

-- Set up RLS policies for storage buckets

-- Vehicle photos bucket policies
CREATE POLICY "Anyone can view vehicle photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle_photos');

CREATE POLICY "Authenticated users can upload vehicle photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle_photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own vehicle photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle_photos' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own vehicle photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle_photos' AND
  auth.uid() = owner
);

-- Vehicle documents bucket policies (more restricted)
CREATE POLICY "Users can view their own vehicle documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'vehicle_documents' AND
  auth.uid() = owner
);

CREATE POLICY "Authenticated users can upload vehicle documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle_documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own vehicle documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle_documents' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own vehicle documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle_documents' AND
  auth.uid() = owner
);
