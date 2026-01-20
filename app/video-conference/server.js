import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const http = createServer(app);
const io = new Server(http);

const PORT = process.env.PORT || 3000;
const rooms = {};

// Serve index.html from same folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve CSS and JS from same folder
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

// Socket.io
io.on('connection', socket => {
  console.log('New user connected: ' + socket.id);

  socket.on('join-room', roomID => {
    socket.join(roomID);

    if (!rooms[roomID]) rooms[roomID] = [];
    rooms[roomID].push(socket.id);

    socket.to(roomID).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.to(roomID).emit('user-disconnected', socket.id);
      rooms[roomID] = rooms[roomID].filter(id => id !== socket.id);
    });

    socket.on('signal', data => {
      io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });
    socket.on('chat-message', msg => {
      io.to(roomID).emit('chat-message', { from: socket.id, message: msg });
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

