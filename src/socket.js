const { Server } = require('socket.io');
const { app } = require('./app');
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
// const Store = mongoose.model('Store');
// Store.find();

const connectedClients = new Map();
const clientSockets = new Map();
io.on('connection', (socket) => {
  console.log('new user connected');
  const { id } = socket;
  connectedClients.set(id, socket);
  const mongodbid = socket.handshake.headers['mongodbid'];
  console.log('MongoDB ID:', mongodbid);
  if (mongodbid) {
    clientSockets.set(mongodbid, socket);
    console.log(`MongoDB ID ${mongodbid} mapped to socket ID ${id}`);
  } else {
    console.log(`No MongoDB ID found for socket ID ${id}`);
  }

  // console.log(connectedClients);
  // console.log(id);
  socket.on('create-order', (data) => {
    console.log(data);
    const targetMongoDBId = data.store; // Assuming targetMongoDBId is present in the data received from the request
    const targetSocket = clientSockets.get(targetMongoDBId);

    if (targetSocket) {
      targetSocket.emit('newOrder', data);
      console.log(
        `Sent newOrder notification to client with MongoDB ID: ${targetMongoDBId}`,
      );
    } else {
      console.log(
        `Client with MongoDB ID ${targetMongoDBId} is not connected.`,
      );
    }
  });
});
module.exports = { io, server, app };
