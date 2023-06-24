const path = require('path');
require(path.join(__dirname, 'models'));

const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const securityProviderMW = require(path.join(
  __dirname,
  'middleware',
  'security-provider.mw',
));
const errorMW = require(path.join(__dirname, 'middleware', 'error.mw'));

const routes = require(path.join(__dirname, 'routes'));

app.use(securityProviderMW);
app.use(compression());
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(routes);
app.use(errorMW);

io.on('connection', (socket) => {
  console.log('testing');
});

module.exports = {
  app,
  server,
  io,
};
