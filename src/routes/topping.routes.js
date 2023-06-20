const express = require('express')
const path = require('path');
const toppingController = require(path.join(__dirname, "..", "controller", "topping.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', toppingController.index)

Router.post('/', toppingController.create)

Router.get('/:id', toppingController.show)

Router.put('/:id', toppingController.update)

Router.delete('/:id', toppingController.softDelete)

Router.delete('/:id/hard', toppingController.hardDelete)


module.exports = Router
