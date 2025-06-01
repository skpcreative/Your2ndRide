-- Vehicle listings table
CREATE TABLE public.vehicle_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL NOT NULL,
    mileage INTEGER,
    description TEXT,
    images TEXT[],
    status TEXT DEFAULT 'pending',
    moderation_notes TEXT,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_listings ENABLE ROW LEVEL SECURITY;

-- Policies for vehicle_listings
CREATE POLICY "Users can view approved listings" 
ON public.vehicle_listings 
FOR SELECT 
USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" 
ON public.vehicle_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.vehicle_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings" 
ON public.vehicle_listings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all listings" 
ON public.vehicle_listings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
