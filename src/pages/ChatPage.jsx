import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useNotification } from '@/context/NotificationContext';
import { useChat } from '@/hooks/useChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MessageCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import db from '@/lib/chatDB';

export default function ChatPage() {
  const { user } = useAuth();
  const { unreadChats, markRoomAsRead } = useNotification();
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get chat data if a chat is selected
  const { messages, sendMessage, connected } = useChat(
    selectedChat ? selectedChat.roomId : null
  );

  // Load all chats from IndexedDB
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      setLoading(true);
      try {
        // Get all unique roomIds from messages
        const allMessages = await db.messages.toArray();
        const roomsMap = new Map();

        // Group messages by roomId
        allMessages.forEach(msg => {
          if (!roomsMap.has(msg.roomId)) {
            roomsMap.set(msg.roomId, {
              roomId: msg.roomId,
              messages: []
            });
          }
          roomsMap.get(msg.roomId).messages.push(msg);
        });

        // Convert map to array and sort by latest message
        let chats = Array.from(roomsMap.values())
          .map(chat => {
            // Sort messages by timestamp
            chat.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return {
              ...chat,
              latestMessage: chat.messages[0],
              listingId: chat.roomId.split('_')[1]
            };
          })
          .sort((a, b) => new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp));

        // Fetch listing details for each chat
        const chatPromises = chats.map(async (chat) => {
          try {
            const { data: listing } = await supabase
              .from('vehicle_listings')
              .select('id, title, user_id, price')
              .eq('id', chat.listingId)
              .single();

            if (listing) {
              // Get seller details
              const { data: sellerProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', listing.user_id)
                .single();

              return {
                ...chat,
                listing: {
                  ...listing,
                  seller_name: sellerProfile?.full_name || 'Unknown Seller'
                }
              };
            }
            return null;
          } catch (error) {
            console.error('Error fetching listing details:', error);
            return null;
          }
        });

        const resolvedChats = (await Promise.all(chatPromises)).filter(Boolean);
        setActiveChats(resolvedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    await sendMessage(message);
    setMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter chats based on search term
  const filteredChats = activeChats.filter(chat => 
    chat.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.listing.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Mark this room as read when selected
    if (chat && unreadChats[chat.roomId]) {
      markRoomAsRead(chat.roomId);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-5xl py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chat</h1>
          <p>Please log in to view your chats.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6">
      <h1 className="text-2xl font-bold mb-6">My Conversations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageCircle className="h-10 w-10 text-purple-400 mb-2" />
                <p className="text-slate-300">No conversations yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Start chatting with sellers from vehicle listings
                </p>
              </div>
            ) : (
              <div>
                {filteredChats.map((chat) => (
                  <div
                    key={chat.roomId}
                    className={`p-3 border-b cursor-pointer transition-colors ${
                      selectedChat?.roomId === chat.roomId ? 'bg-slate-800' : 'hover:bg-slate-900/50'
                    }`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium truncate text-slate-200">
                        {chat.listing.title}
                        {unreadChats[chat.roomId] && (
                          <Badge 
                            className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold"
                            variant="destructive"
                          >
                            {unreadChats[chat.roomId]}
                          </Badge>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {formatTimestamp(chat.latestMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">
                      {chat.listing.seller_name}
                    </p>
                    <p className="text-sm truncate text-slate-300">
                      {chat.latestMessage.sender === user.id ? 'You: ' : ''}
                      {chat.latestMessage.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-[600px]">
          {selectedChat ? (
            <>
              <div className="p-3 border-b">
                <h3 className="font-medium">{selectedChat.listing.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.listing.seller_name}
                </p>
                {!connected && (
                  <p className="text-xs text-amber-500 mt-1">
                    Connecting to chat server...
                  </p>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-slate-300">No messages yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === user.id
                          ? 'ml-auto items-end'
                          : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          msg.sender === user.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-slate-800 text-white font-medium'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <span>
                          {msg.sender === user.id
                            ? 'You'
                            : selectedChat.listing.seller_name}
                        </span>
                        <span>•</span>
                        <span>{formatTimestamp(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={!connected}
                  className="flex-1 text-white bg-slate-700 border-slate-600 placeholder:text-slate-400"
                />
                <Button 
                  type="submit" 
                  disabled={!connected || !message.trim()}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-12 w-12 text-purple-400 mb-3" />
              <h3 className="text-lg font-medium text-slate-200 mb-1">No conversation selected</h3>
              <p className="text-slate-400">
                Select a conversation from the list to view messages
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-slate-400">
        <p>Note: All messages are stored locally on your device and are not saved on our servers.</p>
      </div>
    </div>
  );
}
