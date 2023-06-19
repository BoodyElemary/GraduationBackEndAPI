const path = require('path');
const toppingTypeModel = require(path.join(__dirname, "..", "models", "toppingType.model"))

class toppingTypeController{

    index(req, res){
        try{
            toppingTypeModel.find()
            .then((toppingType)=>{
                res.json({success: true, message: "all toppingType data are retrieved", data: toppingType})
            })
            .catch((error)=>res.status(500).json({success: false , message: error}))

        }catch(error){res.status(500).json({success: false, message: error})}
    }

    create (req,res){
        try{
            toppingTypeModel.create(req.body)
            .then((createdToppingType)=>res.json({success: true, message: "toppingType is created Successfully", data: createdToppingType}))
            .catch((error)=>res.status(500).json({success:false, message: error}))
        }
        catch(error){
            res.status(500).json({success:false, message: error})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            toppingTypeModel.findOne({_id: id})
            .then((toppingType)=>{
                if(toppingType){
                    res.json({success: true, message: "Getting toppingType data succefully", "data": toppingType})
                }
                else res.status(404).json({success:false, message: "toppingType doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error}))

        }catch(error){res.status(500).json({success:false, message: error})}
    }

    update (req,res){
        try {
            const id = req.params.id
            toppingTypeModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedToppingType)=>{
                if(updatedToppingType) res.json({success:true, data: updatedToppingType, message: "toppingType has been Updated successfully"})
                else res.status(404).json({success:false, message:"toppingType doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error}))
        } catch (error) {
            res.status(500).json({success:false, message: error})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            toppingTypeModel.findByIdAndDelete(id)
            .then((deletedToppingType)=>{
                if(deletedToppingType) res.json({success:true, data: deletedToppingType, message: "toppingType has been deleted successfully"})
                else res.status(404).json({success:false, message:"toppingType doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error}))
        }
        catch(error){
            res.status(500).json({success:false, message: error})
        }

    }

}

module.exports = new toppingTypeController()
