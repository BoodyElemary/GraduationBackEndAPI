const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('testing');
});

module.exports = {
  app,
  server,
  io,
  cors,
};
