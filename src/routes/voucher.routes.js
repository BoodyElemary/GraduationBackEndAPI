const express = require('express')
const path=require('path')
const voucherController = require(path.join(__dirname,'..','controller','voucher.controller'))
// const voucherController = require('../controller/voucher.controller')
const Router = express.Router({mergeParams:true})

Router.get('/', voucherController.index)

Router.post('/', voucherController.create)

Router.get('/:code', voucherController.show)

Router.put('/:id', voucherController.update)

Router.delete('/:id', voucherController.delete)
Router.delete('/:id', voucherController.softDelete)

module.exports = Router
