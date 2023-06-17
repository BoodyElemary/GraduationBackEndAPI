// const path=require('path')
// const storeModel = require(path.join(__dirname,'..','models','store.model'))
const storeModel = require('../models/store.model')

class storeController{

    index(req, res){
        try{
            storeModel.find()
            .then((stores)=>{
                res.json({success: true, message: "all stores data are retrieved", data: stores})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            storeModel.create(req.body)
            .then((createdstore)=>res.json({success: true, message: "store is created Successfully", data: createdstore}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            storeModel.findOne({_id: id})
            .then((store)=>{
                if(store){
                    res.json({success: true, message: "Getting store data succefully", "data": store})
                }
                else res.status(404).json({success:false, message: "store doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            storeModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedstore)=>{
                if(updatedstore) res.json({success:true, data: updatedstore, message: "store has been Updated successfully"})
                else res.status(404).json({success:false, message:"store doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            storeModel.findByIdAndDelete(id)
            .then((deletedstore)=>{
                if(deletedstore) res.json({success:true, data: deletedstore, message: "store has been deleted successfully"})
                else res.status(404).json({success:false, message:"store doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new storeController()
