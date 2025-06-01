import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Send, AlertCircle } from 'lucide-react';

export function ChatModal({ isOpen, onClose, listingId, sellerId, sellerName, listingTitle }) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Create a unique room ID based on the listing and the two users
  const roomId = `listing_${listingId}_${user?.id < sellerId ? `${user?.id}_${sellerId}` : `${sellerId}_${user?.id}`}`;
  
  const { messages, loading, error, connected, sendMessage } = useChat(roomId);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const success = await sendMessage(message);
    if (success) {
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Chat about: {listingTitle}
          </DialogTitle>
          {!connected && (
            <div className="flex items-center gap-2 text-amber-500 text-sm mt-1">
              <AlertCircle size={16} />
              <span>Connecting to chat server...</span>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex flex-col h-[350px] overflow-y-auto border rounded-md p-3 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">
              <p>{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === user?.id
                      ? 'ml-auto items-end'
                      : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-800 text-white font-medium'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span>{msg.sender === user?.id ? 'You' : sellerName}</span>
                    <span>•</span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-white bg-slate-700 border-slate-600 placeholder:text-slate-400"
            disabled={!connected || loading}
          />
          <Button 
            type="submit" 
            disabled={!connected || !message.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <DialogFooter className="text-xs text-muted-foreground">
          <p>Messages are stored only on your device</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
