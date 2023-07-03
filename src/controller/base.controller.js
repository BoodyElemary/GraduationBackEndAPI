const path = require('path');
const baseModel = require(path.join(__dirname, '..', 'models', 'base.model'));
const orderModel = require(path.join(__dirname, '..', 'models', 'order.model'));
const { uploadImageToFirebaseStorage, deleteImageFromFirebaseStorage } = require(path.join(
  __dirname,
  'uploadFile.controller',
));

class baseController {
  index(req, res) {
    try {
      baseModel
        .find({ isDeleted: false }).sort({ createdAt: -1 })
        .then((bases) => {
          res.json({
            success: true,
            message: 'all bases data are retrieved',
            data: bases,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  async create(req, res, io) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success:  false, message: 'Please upload a picture file' });
      }
      const response = await uploadImageToFirebaseStorage(req.file, 'bases');
      if (!response.success) {
        return res
          .status(500)
          .json({ success: false, message: response.message });
      }
      baseModel
        .create({ ...req.body, picture: response.downloadURL })
        .then((createdBase) => {

          return res.json({
            success: true,
            message: 'Base is created successfully',
            data: createdBase,
          });
        })
        .catch((error) => {
          if (error.code === 11000 && error.keyPattern && error.keyValue) {
            const { keyPattern, keyValue } = error;
            const duplicateField = Object.keys(keyPattern)[0];
            const duplicateValue = keyValue[duplicateField];
            return res.status(400).json({
              success: false,
              message: `The ${duplicateField} '${duplicateValue}' already exists`,
            });
          }
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  show(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findOne({ _id: id })
        .then((base) => {
          res.json({
            success: true,
            message: 'Getting base data succefully',
            data: base,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      let entryData = req.body;
      let base = await baseModel.findOne({_id: id})
      if (!base){
        return res.status(404).json({ success: false, message: "base doesn't exist" })
      }
      if (req.file) {
        const response = await uploadImageToFirebaseStorage(req.file, 'bases');
        console.log(response);

        if (!response.success) {
          return res
            .status(500)
            .json({ success: false, message: response.message });
        }
        entryData = { ...req.body, picture: response.downloadURL };
        await deleteImageFromFirebaseStorage(base.picture)

      }

      baseModel
        .findOneAndUpdate({ _id: id }, { $set: entryData }, { new: true })
        .then(async(updatedbase) => {
          res.json({
            success: true,
            data: updatedbase,
            message: 'base has been Updated successfully',
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  softDelete(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { isDeleted: true } },
          { new: true },
        )
        .then((deletedbase) => {
          res.json({
            success: true,
            data: deletedbase,
            message: 'base has been deleted successfully',
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  async hardDelete(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findOneAndDelete({ _id: id })
        .then(async(deletedbase) => {
          await deleteImageFromFirebaseStorage(deletedbase.picture)
          orderModel
            .deleteMany({ base: id })
            .then(() =>
              res.json({
                success: true,
                data: deletedbase,
                message: 'Base has been deleted Permanently',
              }),
            )
            .catch((error) =>{
              console.log(error);
              res.status(500).json({ success: false, message: error })
            }
            );
        })
        .catch((error) =>{
          console.log(error);
          res.status(500).json({ success: false, message: error })
        }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error })

    }
  }
}

module.exports = new baseController();
