const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Create a proper Socket.IO instance with CORS support
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend URL if separate
    methods: ["GET", "POST"]
  }
});


// Use Render's dynamic port (very important)
const PORT = process.env.PORT || 3000;

const clients = []; // Track connected clients

// Serve the client HTML
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// Socket.IO connection handler
io.on('connection', (socket) => {
  clients.push(socket.id);
  console.log(`User connected: ${socket.id}, total: ${clients.length}`);

  // Handle disconnects
  socket.on('disconnect', () => {
    const index = clients.indexOf(socket.id);
    if (index !== -1) clients.splice(index, 1);
    console.log(`User disconnected: ${socket.id}, total: ${clients.length}`);
  });


  // Example events
  socket.on('openDoor', () => {
    io.emit('doorEvent');

    console.log('time:', new Date().toLocaleString(),': doorEvent');
  });

  socket.on('lightOn', () => {
    io.emit('lightOn');
  });

  socket.on('lightOff', () => {
    io.emit('lightOff');
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});