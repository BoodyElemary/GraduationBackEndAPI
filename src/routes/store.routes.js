const express = require('express')
const path=require('path')
// const storeController = require(path.join(__dirname,'..','controller','store.controller'))
const storeController = require('../controller/store.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', storeController.index)

Router.post('/', storeController.create)

Router.get('/:id', storeController.show)

Router.put('/:id', storeController.update)

Router.delete('/:id', storeController.delete)

module.exports = Router
