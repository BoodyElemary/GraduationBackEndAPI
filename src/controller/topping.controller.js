const path = require('path');
const toppingModel = require(path.join(__dirname, "..", "models", "topping.model"))

class toppingController{

    index(req, res){
        try{
            toppingModel.find()
            .then((toppings)=>{
                res.json({success: true, message: "all toppings data are retrieved", data: toppings})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            toppingModel.create(req.body)
            .then((createdTopping)=>res.json({success: true, message: "topping is created Successfully", data: createdTopping}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            toppingModel.findOne({_id: id})
            .then((topping)=>{
                if(topping){
                    res.json({success: true, message: "Getting topping data succefully", "data": topping})
                }
                else res.status(404).json({success:false, message: "topping doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            toppingModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedTopping)=>{
                if(updatedTopping) res.json({success:true, data: updatedTopping, message: "topping has been Updated successfully"})
                else res.status(404).json({success:false, message:"topping doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            toppingModel.findByIdAndDelete(id)
            .then((deletedTopping)=>{
                if(deletedTopping) res.json({success:true, data: deletedTopping, message: "topping has been deleted successfully"})
                else res.status(404).json({success:false, message:"topping doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new toppingController()
