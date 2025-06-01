-- Add imagePreviewUrls column to vehicle_listings table
ALTER TABLE vehicle_listings 
ADD COLUMN IF NOT EXISTS imagePreviewUrls JSONB;

-- Comment explaining the purpose of this column
COMMENT ON COLUMN vehicle_listings.imagePreviewUrls IS 'Stores preview URLs for images in JSON format for UI display';
