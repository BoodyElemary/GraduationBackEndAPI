const path = require('path');
const flavorModel = require(path.join(__dirname, "..", "models", "flavor.model"))

class flavorController{

    index(req, res){
        try{
            flavorModel.find()
            .then((flavors)=>{
                res.json({success: true, message: "all flavors data are retrieved", data: flavors})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            flavorModel.create(req.body)
            .then((createdflavor)=>res.json({success: true, message: "flavor is created Successfully", data: createdflavor}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            flavorModel.findOne({_id: id})
            .then((flavor)=>{
                if(flavor){
                    res.json({success: true, message: "Getting flavor data succefully", "data": flavor})
                }
                else res.status(404).json({success:false, message: "flavor doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            flavorModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedflavor)=>{
                if(updatedflavor) res.json({success:true, data: updatedflavor, message: "flavor has been Updated successfully"})
                else res.status(404).json({success:false, message:"flavor doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    delete (req,res){
        try{
            const id = req.params.id
            flavorModel.findByIdAndDelete(id)
            .then((deletedflavor)=>{
                if(deletedflavor) res.json({success:true, data: deletedflavor, message: "flavor has been deleted successfully"})
                else res.status(404).json({success:false, message:"flavor doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new flavorController()
