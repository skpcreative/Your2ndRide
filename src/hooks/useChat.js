import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import io from 'socket.io-client';
import db from '@/lib/chatDB';

// Create a single socket instance to be shared across components
let socket;
if (!socket) {
  // Use environment variable or fallback to localhost for development
  const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:5000';
  socket = io(CHAT_SERVER_URL, { autoConnect: false });
}

export const useChat = (roomId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  // Track if the component is mounted
  const isMounted = useRef(true);
  // Track sent message IDs to prevent duplicates
  const sentMessageIds = useRef(new Set());

  // Join chat room on component mount
  useEffect(() => {
    if (!user || !roomId) return;

    isMounted.current = true;

    // Connect to socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }
    
    // Handle connection events
    const handleConnect = () => {
      if (isMounted.current) {
        setConnected(true);
        console.log('Connected to chat server');
        
        // Register user with their ID
        if (user?.id) {
          socket.emit('registerUser', user.id);
        }
        
        // Join the room
        socket.emit('joinRoom', roomId);
      }
    };

    const handleConnectError = (err) => {
      if (isMounted.current) {
        console.error('Connection error:', err);
        setError('Failed to connect to chat server');
        setConnected(false);
      }
    };

    const handleDisconnect = () => {
      if (isMounted.current) {
        setConnected(false);
        console.log('Disconnected from chat server');
      }
    };

    // Handle receiving messages
    const handleReceiveMessage = async (message) => {
      if (!isMounted.current) return;
      
      // Check if this is a message we sent (to avoid duplicates)
      if (message.sender === user.id && sentMessageIds.current.has(message.id)) {
        // We already have this message locally, don't add it again
        return;
      }
      
      // Save message to IndexedDB
      try {
        await db.messages.add({
          ...message,
          roomId
        });
        
        // Update state
        loadMessages();
      } catch (err) {
        console.error('Error saving received message:', err);
      }
    };

    // Load existing messages from IndexedDB
    loadMessages();

    // Handle new message notifications
    const handleNewMessageNotification = (notification) => {
      if (!isMounted.current) return;
      
      // Check if this notification is for the current user
      if (notification.recipientId === user?.id) {
        console.log('New message notification:', notification);
        
        // If we're not already in this room, join it
        if (notification.roomId !== roomId) {
          // This is for a different chat room - we could trigger a notification here
          // For now, we'll just log it
          console.log(`New message in room ${notification.roomId} from ${notification.senderName}`);
          
          // You could dispatch a custom event or use a notification context here
          const event = new CustomEvent('newChatMessage', { 
            detail: notification 
          });
          window.dispatchEvent(event);
        }
      }
    };
    
    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('newMessageNotification', handleNewMessageNotification);

    // If already connected, manually trigger the connect handler
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      // Mark component as unmounted
      isMounted.current = false;
      
      // Clean up listeners on unmount
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('newMessageNotification', handleNewMessageNotification);
      
      // Don't disconnect the socket here, as it might be used by other components
      // Just leave the room instead
      if (socket.connected) {
        socket.emit('leaveRoom', roomId);
      }
    };
  }, [user, roomId]);

  // Load messages from IndexedDB
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const storedMessages = await db.messages
        .where('roomId')
        .equals(roomId)
        .toArray();
      
      // Sort messages by timestamp
      storedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      setMessages(storedMessages);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Send a message
  const sendMessage = useCallback(async (content) => {
    if (!user || !roomId || !content.trim() || !connected) return;

    try {
      // Generate a unique ID for this message to track it
      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const message = {
        id: messageId,
        sender: user.id,
        senderName: user.user_metadata?.full_name || user.email,
        content,
        timestamp: new Date().toISOString(),
      };

      // Add to our sent messages set to prevent duplication
      sentMessageIds.current.add(messageId);
      
      // Save to local DB first (optimistic update)
      await db.messages.add({
        ...message,
        roomId
      });
      
      // Refresh messages to show immediately
      await loadMessages();
      
      // Then emit to socket server
      socket.emit('sendMessage', { roomId, message });
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return false;
    }
  }, [user, roomId, connected, loadMessages]);

  return {
    messages,
    loading,
    error,
    connected,
    sendMessage,
    refreshMessages: loadMessages
  };
};
