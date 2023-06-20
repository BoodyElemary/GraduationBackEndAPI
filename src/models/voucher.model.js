const path = require('path');
const productModel = require(path.join(__dirname, "..", "models", "product.model"))
const orderModel = require(path.join(__dirname, "..", "models", "order.model"))


class productController{

    index(req, res){
        try{
            productModel.find({isDeleted: false})
            .then((products)=>{
                res.json({success: true, message: "all products data are retrieved", data: products})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.errors}))

        }catch(error){res.status(500).json({success: false, message: error.errors})}

    }


    create (req,res){
        try{
            productModel.create(req.body)
            .then((createdProduct)=>res.json({success: true, message: "product is created Successfully", data: createdProduct}))
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }

    
  }


    show (req, res){
        try{
            const id = req.params.id
            productModel.findOne({_id: id})
            .then((product)=>{
                res.json({success: true, message: "Getting product data succefully", "data": product})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))

        }catch(error){res.status(500).json({success:false, message: error.errors})}

    
  }


    update (req,res){
        try {
            const id = req.params.id
            productModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedProduct)=>{
              res.json({success:true, data: updatedProduct, message: "product has been Updated successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        } catch (error) {
            res.status(500).json({success:false, message: error.errors})
        }
    
  }

    softDelete (req,res){
        try{
            const id = req.params.id
            productModel.findOneAndUpdate({_id: id}, {$set: {isDeleted: true}}, {new: true})
            .then((deletedProduct)=>{
                res.json({success:true, data: deletedProduct, message: "product has been deleted successfully"})
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
            productModel.findOneAndDelete({_id: id})
            .then(async(deletedProduct)=>{
                orderModel.deleteMany({'orderedProducts.product': id})
                .then(()=>res.json({success:true, data: deletedProduct, message: "Product has been deleted Permanently"}))
                .catch((error)=>res.status(500).json({success:false, message: error.errors}))

            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }

    }
}
module.exports = new productController();
