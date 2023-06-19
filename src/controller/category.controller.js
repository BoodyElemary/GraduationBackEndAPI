const path = require('path');
const categoryModel = require(path.join(__dirname, "..", "models", "category.model"))

class categoryController{

    index(req, res){
        try{
            categoryModel.find()
            .then((categories)=>{
                res.json({success: true, message: "all categories data are retrieved", data: categories})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            categoryModel.create(req.body)
            .then((createdCategory)=>res.json({success: true, message: "category is created Successfully", data: createdCategory}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            categoryModel.findOne({_id: id})
            .then((category)=>{
                if(category){
                    res.json({success: true, message: "Getting category data succefully", "data": category})
                }
                else res.status(404).json({success:false, message: "category doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            categoryModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedCategory)=>{
                if(updatedCategory) res.json({success:true, data: updatedCategory, message: "category has been Updated successfully"})
                else res.status(404).json({success:false, message:"category doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            categoryModel.findByIdAndDelete(id)
            .then((deletedCategory)=>{
                if(deletedCategory) res.json({success:true, data: deletedCategory, message: "category has been deleted successfully"})
                else res.status(404).json({success:false, message:"category doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new categoryController()
