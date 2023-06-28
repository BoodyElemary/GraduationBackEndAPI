const { Server } = require('socket.io');
const {app} = require("./app");
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('create-order', (data) => {
    console.log(data);
    socket.broadcast.emit('newOrder', data)

  });

});
module.exports = {io, server, app};


