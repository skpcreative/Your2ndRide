# Real-Time Chat Feature for Your2ndRide

This document explains how to set up and use the real-time chat feature that allows buyers and sellers to communicate directly through the Your2ndRide platform.

## Features

- Real-time messaging using Socket.IO
- Messages stored locally on the user's device using IndexedDB (via Dexie.js)
- No server-side message storage for privacy
- Unique chat rooms for each buyer-seller pair per listing
- Responsive UI that works on all devices

## Setup Instructions

### 1. Start the Chat Server

The chat server needs to be running for real-time communication to work:

```bash
# Navigate to the server directory
cd server

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

The server will run on port 5000 by default.

### 2. Start the Frontend Application

In a separate terminal:

```bash
# From the project root directory
npm run dev
```

## How to Use

### As a Buyer:

1. Browse vehicle listings
2. On a listing detail page, click the "Chat with Seller" button
3. Type your message and click "Send"
4. Messages will be saved to your device and sent in real-time to the seller if they're online

### As a Seller:

1. Receive notifications when buyers send messages
2. Access all your conversations from the "Chat" page in the navigation menu
3. Reply to inquiries about your listings

### Chat Page

The dedicated Chat page shows all your active conversations. You can:

- See all your conversations in one place
- View conversation history
- Continue conversations with buyers/sellers
- Search through your conversations

## Technical Implementation

- Frontend: React with Socket.IO client and Dexie.js
- Backend: Node.js with Express and Socket.IO
- Data Storage: IndexedDB on the client side only

## Privacy Notes

- Messages are stored only on your device
- The server does not save or log any message content
- When you clear your browser data, your chat history will be deleted
