const { log } = require("console");
const path=require('path')
const storeModel = require(path.join(__dirname,'..','models','store.model'))
const adminModel = require(path.join(__dirname, "..", "models", "admin.model"));

// const storeModel = require('../models/store.model')
const { uploadImageToFirebaseStorage } = require(path.join(
    __dirname,
    "uploadFile.controller"
  ));

class storeController{
 index(req, res){
        try{
            storeModel.find()
            .then((stores)=>{
                res.json({
                    success: true, 
                    message: "all stores data are retrieved",
                     data: stores
                    });
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message})
            );

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

   async create (req,res){
        try{
            // if (!req.files) {
            //     return res
            //       .status(400)
            //       .json({ success: false, message: "please upload  pictures " });
            //   }
              const response = await uploadImageToFirebaseStorage(req.files.heroImage, "stores/heroImage");
              const responseImage = await uploadImageToFirebaseStorage(req.files.pageImage, "stores/pageImage");

              if (!response.success) {
                res.status(500).json({ success: false, message: response.message });
              }
              if (!responseImage.success) {
                res.status(500).json({ success: false, message: responseImage.message });
              }
            storeModel
            .create({ ...req.body, heroImage: response.downloadURL , pageImage: responseImage.downloadURL})
            .then((createdStore) =>
              res.json({
                success: true,
                message: "Store is created Successfully",
                data: createdStore,
              })
            )
            .catch((error) =>
              res.status(500).json({ success: false, message: error.errors })
            );
        }
        catch(error){
            res.status(500).json({ success: false, message: error.errors })
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            storeModel.findOne({_id: id})
            .then((store)=>{
                if(store){
                    res.json({success: true, message: "Getting store data succefully", "data": store})
                }
                else res.status(404).json({success:false, message: "store doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            storeModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedstore)=>{
                if(updatedstore) res.json({success:true, data: updatedstore, message: "store has been Updated successfully"})
                else res.status(404).json({success:false, message:"store doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    async addDay(req, res){
        try {
            const id = req.params.id
            let store = await storeModel.findOne({_id: id})
            if (!store){
                res.status(404).json({success:false, message:"store doesn't exist"})
            }
            let existDay = store.workingHours.find(working => working.day === req.body.day)
            if(existDay){
                existDay.startHour = req.body.startHour
                existDay.endHour = req.body.endHour
            }
            else{
                store.workingHours.push(req.body)
            }
            store.save()
            res.json({success:true, data: store, message: "Day added successfully"})

        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }

    softDelete(req, res) {
        try {
          const id = req.params.id;
          storeModel
            .findOneAndUpdate(
              { _id: id },
              { $set: { isDeleted: true } },
              { new: true }
            )
            .then((deletedstore) => {
              res.json({
                success: true,
                data: deletedstore,
                message: "store has been deleted successfully",
              });
            })
            .catch((error) =>
              res.status(500).json({ success: false, message: error.errors })
            );
        } catch (error) {
          res.status(500).json({ success: false, message: error.errors });
        }
      }
    
      hardDelete(req, res) {
        try {
          const id = req.params.id;
          storeModel
            .findOneAndDelete({ _id: id })
            .then((deletedstore) => {
              adminModel
                .deleteMany({ base: id })
                .then(() =>
                  res.json({
                    success: true,
                    data: deletedstore,
                    message: "Store has been deleted Permanently",
                  })
                )
                .catch((error) =>
                  res.status(500).json({ success: false, message: error })
                );
            })
            .catch((error) =>
              res.status(500).json({ succe: false, message: error })
            );
        } catch (error) {
          res.status(500).json({ sucs: false, message: error });
        }
      }
    

}

module.exports = new storeController()
