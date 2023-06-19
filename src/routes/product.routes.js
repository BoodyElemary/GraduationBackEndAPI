const express = require('express')
const path = require('path');
const productController = require(path.join(__dirname, "..", "controller", "product.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', productController.index)

Router.post('/', productController.create)

Router.get('/:id', productController.show)

Router.put('/:id', productController.update)

Router.delete('/:id', productController.softDelete)

Router.delete('/:id/hard', productController.hardDelete)

module.exports = Router
