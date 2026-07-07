const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const capsuleRoutes = require('./routes/capsules');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/upload', uploadRoutes);

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('User connected to whiteboard:', socket.id);

  socket.on('draw', (data) => {
    // Broadcast the drawing data to all other connected clients
    socket.broadcast.emit('draw', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
