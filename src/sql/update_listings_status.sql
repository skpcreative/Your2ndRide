-- Update all existing listings to 'approved' status
UPDATE vehicle_listings
SET status = 'approved'
WHERE status = 'pending';

-- Set default value for status column to 'approved'
ALTER TABLE vehicle_listings
ALTER COLUMN status SET DEFAULT 'approved';
