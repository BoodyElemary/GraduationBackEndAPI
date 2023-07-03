const express = require('express');
const path = require('path');
const { server } = require('../app');
const socketIO = require('socket.io');
const io = socketIO(server);
const baseController = require(path.join(
  __dirname,
  '..',
  'controller',
  'base.controller',
));
const { upload } = require(path.join(
  __dirname,
  '..',
  'controller',
  'uploadFile.controller',
));
const Router = express.Router({ mergeParams: true });

Router.get('/', baseController.index);

Router.post('/', upload.single('picture'), (req, res) => {
  baseController.create(req, res, io);
});

Router.get('/:id', baseController.show);

Router.put('/:id', upload.single('picture'), baseController.update);

Router.delete('/:id', baseController.softDelete);

Router.delete('/:id/hard', baseController.hardDelete);

module.exports = Router;
