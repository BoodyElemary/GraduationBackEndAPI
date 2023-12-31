const express = require('express')
const path = require('path');
const toppingTypeController = require(path.join(__dirname, "..", "controller", "toppingType.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', toppingTypeController.index)

Router.post('/', toppingTypeController.create)

Router.get('/:id', toppingTypeController.show)

Router.get('/:id/items', toppingTypeController.getItems)

Router.put('/:id', toppingTypeController.update)

Router.delete('/:id', toppingTypeController.softDelete)

Router.delete('/:id/hard', toppingTypeController.hardDelete)

module.exports = Router
