const { log } = require("console");
const path = require("path");
const storeModel = require(path.join(__dirname, "..", "models", "store.model"));
const adminModel = require(path.join(__dirname, "..", "models", "admin.model"));

// const storeModel = require('../models/store.model')
const { uploadImageToFirebaseStorage, deleteImageFromFirebaseStorage } = require(path.join(
  __dirname,
  "uploadFile.controller"
));

class storeController {
  index(req, res) {
    try {
      storeModel
        .find().sort({ createdAt: -1 })
        .then((stores) => {
          res.json({
            success: true,
            message: "all stores data are retrieved",
            data: stores,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      if (!req.files.heroImage) {
        return res
          .status(400)
          .json({ success: false, message: "please upload  heroImage " });
      }
      else if (!req.files.pageImage) {
        return res
          .status(400)
          .json({ success: false, message: "please upload  pageImage " });
        }
      const heroImageResponse = await uploadImageToFirebaseStorage(
        req.files.heroImage[0],
        "stores/heroImage"
      );
      if (!heroImageResponse.success) {
        res.status(500).json({ success: false, message: heroImageResponse.message });
      }

      const pageImageResponse = await uploadImageToFirebaseStorage(
        req.files.pageImage[0],
        "stores/pageImage"
      );
      if (!pageImageResponse.success) {
        res
          .status(500)
          .json({ success: false, message: pageImageResponse.message });
      }

      storeModel
        .create({
          ...req.body,
          heroImage: heroImageResponse.downloadURL,
          pageImage: pageImageResponse.downloadURL,
        })
        .then((createdStore) =>
          res.json({
            success: true,
            message: "Store is created Successfully",
            data: createdStore,
          })
        )
        .catch((error) =>{
          if (error.code === 11000 && error.keyPattern && error.keyValue) {
            const { keyPattern, keyValue } = error;
            const duplicateField = Object.keys(keyPattern)[0];
            const duplicateValue = keyValue[duplicateField];
            return res.status(400).json({
              success: false,
              message: `The ${duplicateField} '${duplicateValue}' already exists`,
            });
          }
          res.status(500).json({ success: false, message: error})
        }
        );
    } catch (error) {

      res.status(500).json({ success: false, message: error});
    }
  }

  show(req, res) {
    try {
      const name = req.params.name;
      console.log(name);
      storeModel
        .findOne({ name: name })
        .then((store) => {
          if (store) {
            res.json({
              success: true,
              message: "Getting store data succefully",
              data: store,
            });
          } else
            res
              .status(404)
              .json({ success: false, message: "store doesn't exist" });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const name = req.params.name;
      let entryData = req.body
      let store = await storeModel.findOne({name:name})
      if (!store){
        return res.status(404).json({ success: false, message: "store doesn't exist" })
      }
      if(req.files){
        if(req.files.heroImage){
          const heroImageResponse = await uploadImageToFirebaseStorage(
            req.files.heroImage[0],
            "stores/heroImage"
          );

          if (!heroImageResponse.success) {
            return res.status(500).json({ success: false, message: heroImageResponse.message });
          }
          entryData.heroImage = heroImageResponse.downloadURL
          await deleteImageFromFirebaseStorage(store.heroImage)
        }

        if(req.files.pageImage){
          const pageImageResponse = await uploadImageToFirebaseStorage(
            req.files.pageImage[0],
            "stores/pageImage"
          );

          if (!pageImageResponse.success) {
            return res.status(500).json({ success: false, message: pageImageResponse.message });
          }
          entryData.pageImage = pageImageResponse.downloadURL

          await deleteImageFromFirebaseStorage(store.pageImage)
        }
      }
      console.log(name);
      storeModel
        .findOneAndUpdate({ name: name }, { $set: entryData }, { new: true })
        .then((updatedstore) => {
            res.json({
              success: true,
              data: updatedstore,
              message: "store has been Updated successfully",
            });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addDay(req, res) {
    try {
      const name = req.params.name;
      let store = await storeModel.findOne({ name: name });
      if (!store) {
        res
          .status(404)
          .json({ success: false, message: "store doesn't exist" });
      }
      let existDay = store.workingHours.find(
        (working) => working.day === req.body.day
      );
      if (existDay) {
        existDay.startHour = req.body.startHour;
        existDay.endHour = req.body.endHour;
      } else {
        store.workingHours.push(req.body);
      }
      store.save();
      res.json({
        success: true,
        data: store,
        message: "Day added successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  softDelete(req, res) {
    try {
      const name = req.params.name;
      storeModel
        .findOneAndUpdate(
          { name: name },
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

  async hardDelete(req, res) {
    try {
      const name = req.params.name;
      storeModel
        .findOneAndDelete({ name: name })
        .then(async(deletedstore) => {
          await deleteImageFromFirebaseStorage(deletedstore.heroImage)
          await deleteImageFromFirebaseStorage(deletedstore.pageImage)
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

module.exports = new storeController();
