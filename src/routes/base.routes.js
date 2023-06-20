const express = require('express')
const path = require('path');
const baseController = require(path.join(__dirname, "..", "controller", "base.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', baseController.index)

Router.post('/', baseController.create)

Router.get('/:id', baseController.show)

Router.put('/:id', baseController.update)

Router.delete('/:id', baseController.softDelete)

Router.delete('/:id/hard', baseController.hardDelete)

module.exports = Router
