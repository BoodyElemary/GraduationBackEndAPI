require('dotenv').config();
const path = require('path');
const http = require('http');
const { app, server, io } = require('./src/app');

const database = require(path.join(__dirname, 'src', 'util', 'database'));

database(() => {
  server.listen(process.env.PORT, () => {
    console.log('server is runing port ', process.env.PORT);
  });
});
