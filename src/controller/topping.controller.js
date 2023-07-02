const path = require('path');
const toppingModel = require(path.join(__dirname, "..", "models", "topping.model"))
const orderModel = require(path.join(__dirname, "..", "models", "order.model"))

class toppingController{

    index(req, res){
        try{

           toppingModel.find({isDeleted: false}).populate("toppingType").sort({ createdAt: -1 })

            .then((toppings)=>{
                res.json({success: true, message: "all toppings data are retrieved", data: toppings})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.errors}))

        }catch(error){res.status(500).json({success: false, message: error.errors})}
    }

    create (req,res){
        try{
            toppingModel.create(req.body)
            .then((createdTopping)=>res.json({success: true, message: "topping is created Successfully", data: createdTopping}))
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            toppingModel.findOne({_id: id}).populate("topping")
            .then((topping)=>{
                res.json({success: true, message: "Getting topping data succefully", "data": topping})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))

        }catch(error){res.status(500).json({success:false, message: error.errors})}
    }

    update (req,res){
        try {
            const id = req.params.id
            toppingModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedTopping)=>{
                res.json({success:true, data: updatedTopping, message: "topping has been Updated successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        } catch (error) {
            res.status(500).json({success:false, message: error.errors})
        }
    }

    softDelete (req,res){
        try{
            const id = req.params.id
            toppingModel.findOneAndUpdate({_id: id}, {$set: {isDeleted: true}}, {new: true})
            .then((deletedTopping)=>{
                res.json({success:true, data: deletedTopping, message: "topping has been deleted successfully"})
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
            toppingModel.findByIdAndDelete(id)
            .then((deletedTopping)=>{
                orderModel.deleteMany({'orderedCustomizedProducts.toppings.topping': id})
                .then(()=>res.json({success:true, data: deletedTopping, message: "Topping has been deleted Permanently"}))
                .catch((error)=>res.status(500).json({success:false, message: error.errors}))
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

}

module.exports = new toppingController()
