import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatModal } from './ChatModal';
import { useAuth } from '@/context/AuthContext';

export function ChatButton({ listing, recipientId, listingId, className, isOpen, onOpenChange, onAuthRequired }) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen || false);
  const { user } = useAuth();
  
  // If listing object is provided, use its properties
  const sellerId = listing?.user_id || recipientId;
  const actualListingId = listing?.id || listingId;
  
  // Handle external control of modal state
  useEffect(() => {
    if (isOpen !== undefined) {
      setIsModalOpen(isOpen);
    }
  }, [isOpen]);
  
  // Notify parent component when modal state changes
  const handleModalStateChange = (state) => {
    setIsModalOpen(state);
    if (onOpenChange) {
      onOpenChange(state);
    }
  };
  
  // Don't show chat button if user is the seller or if user is not logged in
  if (!user || user.id === sellerId) {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => handleModalStateChange(true)}
        variant="outline"
        size="sm"
        className={`flex items-center gap-1 ${className || ''}`}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Chat with Seller</span>
      </Button>
      
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => handleModalStateChange(false)}
        listingId={actualListingId}
        sellerId={sellerId}
        sellerName={listing?.seller_name || 'Seller'}
        listingTitle={listing?.title || 'Vehicle Listing'}
      />
    </>
  );
}
