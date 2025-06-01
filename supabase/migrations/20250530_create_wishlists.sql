-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, vehicle_id)
);

-- Enable Row Level Security
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own wishlists
CREATE POLICY "Users can view their own wishlists"
    ON public.wishlists
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to add to their wishlists
CREATE POLICY "Users can add to their wishlists"
    ON public.wishlists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to remove from their wishlists
CREATE POLICY "Users can remove from their wishlists"
    ON public.wishlists
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create helper functions
CREATE OR REPLACE FUNCTION public.is_vehicle_wishlisted(vehicle_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.wishlists
        WHERE wishlists.vehicle_id = $1
        AND wishlists.user_id = $2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
