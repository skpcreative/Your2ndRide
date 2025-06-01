import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatModal } from './ChatModal';
import { useAuth } from '@/context/AuthContext';

export function ChatButton({ listing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Don't show chat button if user is the seller or if user is not logged in
  if (!user || user.id === listing.user_id) {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Chat with Seller</span>
      </Button>
      
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listingId={listing.id}
        sellerId={listing.user_id}
        sellerName={listing.seller_name || 'Seller'}
        listingTitle={listing.title}
      />
    </>
  );
}
