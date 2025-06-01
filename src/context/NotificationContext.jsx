import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import db from '@/lib/chatDB';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChats, setUnreadChats] = useState({});
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(() => {
    const saved = localStorage.getItem('lastCheckedTimestamp');
    return saved ? JSON.parse(saved) : {};
  });

  // Listen for new chat message notifications
  useEffect(() => {
    const handleNewChatMessage = (event) => {
      const notification = event.detail;
      
      // Only process notifications for the current user
      if (user?.id === notification.recipientId) {
        // Update unread chats
        setUnreadChats(prev => {
          const updated = { ...prev };
          if (!updated[notification.roomId]) {
            updated[notification.roomId] = {
              count: 0,
              lastMessage: null,
              senderId: notification.senderId,
              senderName: notification.senderName,
              listingId: notification.listingId
            };
          }
          
          updated[notification.roomId].count += 1;
          updated[notification.roomId].lastMessage = notification.timestamp;
          
          return updated;
        });
        
        // Update total unread count
        setUnreadCount(prev => prev + 1);
      }
    };
    
    window.addEventListener('newChatMessage', handleNewChatMessage);
    
    return () => {
      window.removeEventListener('newChatMessage', handleNewChatMessage);
    };
  }, [user]);

  // Load unread messages count
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setUnreadChats({});
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        // Get all messages
        const allMessages = await db.messages.toArray();
        
        // Group messages by roomId
        const messagesByRoom = {};
        allMessages.forEach(msg => {
          if (!messagesByRoom[msg.roomId]) {
            messagesByRoom[msg.roomId] = [];
          }
          messagesByRoom[msg.roomId].push(msg);
        });
        
        // Count unread messages per room
        const unreadByRoom = {};
        let totalUnread = 0;
        
        Object.keys(messagesByRoom).forEach(roomId => {
          const lastChecked = lastCheckedTimestamp[roomId] || 0;
          const unreadMessages = messagesByRoom[roomId].filter(msg => 
            msg.sender !== user.id && 
            new Date(msg.timestamp) > new Date(lastChecked)
          );
          
          if (unreadMessages.length > 0) {
            unreadByRoom[roomId] = unreadMessages.length;
            totalUnread += unreadMessages.length;
          }
        });
        
        setUnreadChats(unreadByRoom);
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    checkUnreadMessages();
    
    // Set up interval to periodically check for new messages
    const intervalId = setInterval(checkUnreadMessages, 10000);
    
    return () => clearInterval(intervalId);
  }, [user, lastCheckedTimestamp]);

  // Save lastCheckedTimestamp to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastCheckedTimestamp', JSON.stringify(lastCheckedTimestamp));
  }, [lastCheckedTimestamp]);

  // Mark a room as read
  const markRoomAsRead = (roomId) => {
    setLastCheckedTimestamp(prev => ({
      ...prev,
      [roomId]: new Date().toISOString()
    }));
    
    // Update unread counts immediately
    setUnreadChats(prev => {
      const updated = { ...prev };
      delete updated[roomId];
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - (unreadChats[roomId] || 0)));
  };

  // Mark all as read
  const markAllAsRead = () => {
    const now = new Date().toISOString();
    const updatedTimestamps = {};
    
    Object.keys(unreadChats).forEach(roomId => {
      updatedTimestamps[roomId] = now;
    });
    
    setLastCheckedTimestamp(prev => ({
      ...prev,
      ...updatedTimestamps
    }));
    
    setUnreadChats({});
    setUnreadCount(0);
  };

  const value = {
    unreadCount,
    unreadChats,
    markRoomAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
