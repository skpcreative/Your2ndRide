-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.get_user_wishlist(UUID);
DROP FUNCTION IF EXISTS public.delete_wishlist_item(UUID, UUID);

-- Function to get user's wishlist with vehicle data
CREATE OR REPLACE FUNCTION public.get_user_wishlist(user_id_param UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    vehicle_id UUID,
    created_at TIMESTAMPTZ,
    vehicle_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.user_id,
        w.vehicle_id,
        w.created_at,
        jsonb_build_object(
            'id', v.id,
            'title', v.title,
            'make', v.make,
            'model', v.model,
            'year', v.year,
            'price', v.price,
            'images', v.images,
            'status', v.status,
            'location', v.location
        ) as vehicle_data
    FROM public.wishlists w
    JOIN public.vehicle_listings v ON w.vehicle_id = v.id
    WHERE w.user_id = user_id_param AND v.status = 'approved'
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely delete a wishlist item
CREATE OR REPLACE FUNCTION public.delete_wishlist_item(wishlist_id_param UUID, user_id_param UUID)
RETURNS void AS $$
BEGIN
    DELETE FROM public.wishlists
    WHERE id = wishlist_id_param AND user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
