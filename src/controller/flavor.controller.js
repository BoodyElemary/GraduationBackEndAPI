const path = require('path');
const flavorModel = require(path.join(__dirname, "..", "models", "flavor.model"))
const orderModel = require(path.join(__dirname, "..", "models", "order.model"))

class flavorController{

    index(req, res){
        try{
            flavorModel.find({isDeleted: false})
            .then((flavors)=>{
                res.json({success: true, message: "all flavors data are retrieved", data: flavors})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.errors}))

        }catch(error){res.status(500).json({success: false, message: error.errors})}
    }

    create (req,res){
        try{
            flavorModel.create(req.body)
            .then((createdflavor)=>res.json({success: true, message: "flavor is created Successfully", data: createdflavor}))
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            flavorModel.findOne({_id: id})
            .then((flavor)=>{
                res.json({success: true, message: "Getting flavor data succefully", "data": flavor})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))

        }catch(error){res.status(500).json({success:false, message: error.errors})}
    }

    update (req,res){
        try {
            const id = req.params.id
            flavorModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedflavor)=>{
               res.json({success:true, data: updatedflavor, message: "flavor has been Updated successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        } catch (error) {
            res.status(500).json({success:false, message: error.errors})
        }
    }

    softDelete (req,res){
        try{
            const id = req.params.id
            flavorModel.findOneAndUpdate({_id: id}, {$set: {isDeleted: true}}, {new: true})
            .then((deletedflavor)=>{
                res.json({success:true, data: deletedflavor, message: "flavor has been deleted successfully"})
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
            flavorModel.findByIdAndDelete(id)
            .then((deletedflavor)=>{
                orderModel.deleteMany({flavor: id})
                .then(()=>res.json({success:true, data: deletedflavor, message: "Flavor has been deleted Permanently"}))
                .catch((error)=>res.status(500).json({success:false, message: error.errors}))
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }

    }

}

module.exports = new flavorController()
