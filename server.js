// server.js - Express + Socket.io multiplayer server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Game state
const players = new Map();
const gameState = {
  level: 1,
  playersCount: 0
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    players: gameState.playersCount,
    level: gameState.level
  });
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  gameState.playersCount++;

  const player = {
    id: socket.id,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    health: 100,
    weapon: 'Revolver',
    joinedAt: Date.now()
  };

  players.set(socket.id, player);

  // Notify others about new player
  socket.broadcast.emit('player-joined', player);

  // Send existing players to new player
  socket.emit('players-list', Array.from(players.values()));

  // Player movement
  socket.on('player-move', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      socket.broadcast.emit('player-moved', player);
    }
  });

  // Player shooting
  socket.on('player-shot', (data) => {
    const shooter = players.get(socket.id);
    if (shooter) {
      // Broadcast shot to other players
      socket.broadcast.emit('player-shot', {
        shooterId: socket.id,
        position: data.position,
        direction: data.direction
      });
    }
  });

  // Damage system
  socket.on('damage', (data) => {
    const target = players.get(data.targetId);
    if (target) {
      target.health = Math.max(0, target.health - data.damage);
      io.emit('player-damaged', {
        playerId: data.targetId,
        health: target.health,
        damageDealer: socket.id
      });

      if (target.health === 0) {
        target.health = 100; // Respawn
        io.emit('player-respawned', {
          playerId: data.targetId,
          killedBy: socket.id
        });
      }
    }
  });

  // Chat
  socket.on('chat', (data) => {
    io.emit('chat-message', {
      playerId: socket.id,
      message: data.message,
      timestamp: Date.now()
    });
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    players.delete(socket.id);
    gameState.playersCount--;
    socket.broadcast.emit('player-left', socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 Iron Epoch: 1899 Server running on port ${PORT}`);
  console.log(`   Players online: 0/${gameState.playersCount}`);
  console.log(`   Level: ${gameState.level}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
