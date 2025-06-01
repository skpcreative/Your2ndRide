import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/context/NotificationContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function ChatNotifications() {
  const { unreadCount, unreadChats, markRoomAsRead } = useNotification();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Close dropdown when navigating
  useEffect(() => {
    return () => setOpen(false);
  }, []);
  
  const handleChatOpen = (roomId, listingId) => {
    // Mark as read
    markRoomAsRead(roomId);
    
    // Close dropdown
    setOpen(false);
    
    // Navigate to the listing
    navigate(`/listing/${listingId}`, { state: { openChat: true, roomId } });
  };
  
  if (unreadCount === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>New Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(unreadChats).length === 0 ? (
          <div className="py-2 px-4 text-center text-sm text-muted-foreground">
            No unread messages
          </div>
        ) : (
          Object.entries(unreadChats).map(([roomId, data]) => (
            <DropdownMenuItem key={roomId} className="p-0">
              <button
                className="flex items-start justify-between w-full px-2 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
                onClick={() => handleChatOpen(roomId, data.listingId)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{data.senderName || 'User'}</span>
                  <span className="text-xs text-muted-foreground">
                    {data.lastMessage ? format(new Date(data.lastMessage), 'MMM d, h:mm a') : ''}
                  </span>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {data.count}
                </Badge>
              </button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
