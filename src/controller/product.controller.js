const productModel = require('../models/product.model')

class productController{

    index(req, res){
        try{
            productModel.find()
            .then((products)=>{
                res.json({success: true, message: "all products data are retrieved", data: products})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            productModel.create(req.body)
            .then((createdProduct)=>res.json({success: true, message: "product is created Successfully", data: createdProduct}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            productModel.findOne({_id: id})
            .then((product)=>{
                if(product){
                    res.json({success: true, message: "Getting product data succefully", "data": product})
                }
                else res.status(404).json({success:false, message: "product doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            productModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedProduct)=>{
                if(updatedProduct) res.json({success:true, data: updatedProduct, message: "product has been Updated successfully"})
                else res.status(404).json({success:false, message:"product doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            productModel.findByIdAndDelete(id)
            .then((deletedProduct)=>{
                if(deletedProduct) res.json({success:true, data: deletedProduct, message: "product has been deleted successfully"})
                else res.status(404).json({success:false, message:"product doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new productController()
