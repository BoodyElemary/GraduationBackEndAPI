const express = require('express')
const productController = require('../controller/product.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', productController.index)

Router.post('/', productController.create)

Router.get('/:id', productController.show)

Router.put('/:id', productController.update)

Router.delete('/:id', productController.delete)

module.exports = Router
