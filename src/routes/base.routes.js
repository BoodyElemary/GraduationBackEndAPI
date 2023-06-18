const express = require('express')
const baseController = require('../controller/base.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', baseController.index)

Router.post('/', baseController.create)

Router.get('/:id', baseController.show)

Router.put('/:id', baseController.update)

Router.delete('/:id', baseController.delete)

module.exports = Router
