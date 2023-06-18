const express = require('express')
const categoryController = require('../controller/category.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', categoryController.index)

Router.post('/', categoryController.create)

Router.get('/:id', categoryController.show)

Router.put('/:id', categoryController.update)

Router.delete('/:id', categoryController.delete)

module.exports = Router
