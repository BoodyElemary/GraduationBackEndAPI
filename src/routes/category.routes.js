const express = require('express')
const path = require('path');
const categoryController = require(path.join(__dirname, "..", "controller", "category.controller"))
const {upload} = require(path.join(__dirname, "..", "controller", "uploadFile.controller"))
const Router = express.Router({mergeParams:true})

Router.get('/', categoryController.index)

Router.post('/', upload.single("picture"), categoryController.create)

Router.get('/:id', categoryController.show)

Router.put('/:id', upload.single("picture"), categoryController.update)

Router.delete('/:id', categoryController.softDelete)

Router.delete('/:id/hard', categoryController.hardDelete)

module.exports = Router
