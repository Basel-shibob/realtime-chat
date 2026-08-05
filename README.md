# Realtime Chat

A real-time chat application built with Node.js, Express, and Socket.io.

## Features
- Real-time messaging with multiple chat rooms
- Usernames with join/leave notifications
- Typing indicator
- Online users list per room
- Chat history persisted with MongoDB
- Server-side input validation, rate limiting, and centralized error handling

## Tech Stack
- Node.js, Express
- Socket.io
- MongoDB + Mongoose

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (or a MongoDB Atlas connection string)

### Installation
```bash
git clone https://github.com/Basel-shibob/realtime-chat.git
cd realtime-chat
npm install
```

### Environment Variables
Create a `.env` file in the root:
```
MONGO_URI=mongodb://localhost:27017/realtime-chat
PORT=3000
```

### Running the app
```bash
npm start
```
Then open `http://localhost:3000`

## Project Structure

```
realtime-chat/
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Message.js
│   └── middleware/
│       └── errorHandler.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```