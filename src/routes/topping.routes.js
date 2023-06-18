const express = require('express')
const toppingController = require('../controller/topping.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', toppingController.index)

Router.post('/', toppingController.create)

Router.get('/:id', toppingController.show)

Router.put('/:id', toppingController.update)

Router.delete('/:id', toppingController.delete)

module.exports = Router
