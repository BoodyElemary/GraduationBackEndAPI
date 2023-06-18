const express = require('express')
const flavorController = require('../controller/flavor.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', flavorController.index)

Router.post('/', flavorController.create)

Router.get('/:id', flavorController.show)

Router.put('/:id', flavorController.update)

Router.delete('/:id', flavorController.delete)

module.exports = Router
