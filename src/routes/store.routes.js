
const express = require("express");
const path = require("path");

const storeController = require(path.join(__dirname,'..','controller','store.controller'))
// const storeController = require('../controller/store.controller')
const {upload} = require(path.join(__dirname, "..", "controller", "uploadFile.controller"))
const Router = express.Router({mergeParams:true})


Router.get("/", storeController.index);


Router.post('/',
    upload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "pageImage", maxCount: 1 }
    ]),
    storeController.create
)


Router.get("/:name", storeController.show);


Router.put('/:name',
    upload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "pageImage", maxCount: 1 }
    ]),
    storeController.update
)

Router.put('/:name/addDay', storeController.addDay)

Router.delete('/:name', storeController.softDelete)

Router.delete('/:name/hard', storeController.hardDelete)


module.exports = Router;
