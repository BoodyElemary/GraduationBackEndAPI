const express = require('express')
const path=require('path')
// const storeController = require(path.join(__dirname,'..','controller','store.controller'))
const voucherController = require('../controller/voucher.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', voucherController.index)

Router.post('/', voucherController.create)

Router.get('/:id', voucherController.show)

Router.put('/:id', voucherController.update)

Router.delete('/:id', voucherController.delete)

module.exports = Router