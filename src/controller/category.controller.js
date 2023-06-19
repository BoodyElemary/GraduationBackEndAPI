const path = require('path');
const categoryModel = require(path.join(__dirname, "..", "models", "category.model"))
const productModel = require(path.join(__dirname, "..", "models", "product.model"))

class categoryController{

    index(req, res){
        try{
            categoryModel.find({isDeleted: false})
            .then((categories)=>{
                res.json({success: true, message: "all categories data are retrieved", data: categories})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.errors}))

        }catch(error){res.status(500).json({success: false, message: error.errors})}
    }

    create (req,res){
        try{
            categoryModel.create(req.body)
            .then((createdCategory)=>res.json({success: true, message: "category is created Successfully", data: createdCategory}))
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            categoryModel.findOne({_id: id})
            .then((category)=>{
                res.json({success: true, message: "Getting category data succefully", "data": category})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))

        }catch(error){res.status(500).json({success:false, message: error.errors})}
    }

    update (req,res){
        try {
            const id = req.params.id
            categoryModel.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedCategory)=>{
                res.json({success:true, data: updatedCategory, message: "category has been Updated successfully"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        } catch (error) {
            res.status(500).json({success:false, message: error.errors})
        }
    }

    softDelete (req,res){
        try{
            const id = req.params.id
            categoryModel.findOneAndUpdate({_id: id}, {$set: {isDeleted: true}}, {new: true})
            .then((deletedCategory)=>{
               res.json({success:true, data: deletedCategory, message: "category has been deleted successfully"})
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
            categoryModel.findOneAndDelete({_id: id})
            .then((deletedCategory)=>{
                productModel.deleteMany({category: id})
                .then(()=>res.json({success:true, data: deletedCategory, message: "category has been deleted Permanently"}))
                .catch((error)=>res.status(500).json({success:false, message: error.errors}))

            })
            .catch((error)=>res.status(500).json({success:false, message: error.errors}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.errors})
        }

    }

}

module.exports = new categoryController()
