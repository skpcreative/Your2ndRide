-- Add phone column to vehicle_listings table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vehicle_listings' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE vehicle_listings ADD COLUMN phone TEXT;
    END IF;
END $$;
