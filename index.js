require('dotenv').config();
const path = require('path');
const { server, app } = require('./src/socket');
const database = require(path.join(__dirname, 'src', 'util', 'database'));


database(() => {
  server.listen(process.env.PORT, () => {
    console.log('server is runing port ', process.env.PORT);
  });
});
