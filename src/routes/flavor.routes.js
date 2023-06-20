const express = require('express')
const path = require('path');
const flavorController = require(path.join(__dirname, "..", "controller", "flavor.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', flavorController.index)

Router.post('/', flavorController.create)

Router.get('/:id', flavorController.show)

Router.put('/:id', flavorController.update)

Router.delete('/:id', flavorController.softDelete)

Router.delete('/:id/hard', flavorController.hardDelete)

module.exports = Router
