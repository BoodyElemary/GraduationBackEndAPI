const path = require('path');
const toppingTypeModel = require(path.join(__dirname, "..", "models", "toppingType.model"))
const toppingModel = require(path.join(__dirname, "..", "models", "topping.model"))

class toppingTypeController{

    index(req, res){
        try{
            toppingTypeModel.find({isDeleted: false})
            .then((toppingType)=>{
                res.json({success: true, message: "all toppingType data are retrieved", data: toppingType})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.errors}))

        }catch(error){res.status(500).json({success: false, message: error.errors})}
    }

    create (req,res){
        try{
            toppingTypeModel.create(req.body)
            .then((createdToppingType)=>res.json({success: true, message: "toppingType is created Successfully", data: createdToppingType}))
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            toppingTypeModel.findOne({_id: id})
            .then((toppingType)=>{
                res.json({success: true, message: "Getting toppingType data succefully", "data": toppingType})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))

        }catch(error){res.status(500).json({success:false, message: error.errors})}
    }

    update (req,res){
        try {
            const id = req.params.id
            toppingTypeModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedToppingType)=>{
               res.json({success:true, data: updatedToppingType, message: "toppingType has been Updated successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        } catch (error) {
            res.status(500).json({success:false, message: error.errors})
        }
    }

    softDelete (req,res){
        try{
            const id = req.params.id
            toppingTypeModel.findByIdAndUpdate(id)
            .then((deletedToppingType)=>{
              res.json({success:true, data: deletedToppingType, message: "toppingType has been deleted successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

    hardDelete (req,res){
        try{
            const id = req.params.id
            toppingTypeModel.findByIdAndDelete(id)
            .then((deletedToppingType)=>{
                toppingModel.deleteMany({flavor: id})
                .then(()=>res.json({success:true, data: deletedToppingType, message: "toppingType has been deleted Permanently"}))
                .catch((error)=>res.status(500).json({success:false, message: error.errors}))
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

}

module.exports = new toppingTypeController()
