const path = require("path");
const baseModel = require(path.join(__dirname, "..", "models", "base.model"));
const orderModel = require(path.join(__dirname, "..", "models", "order.model"));
const { uploadImageToFirebaseStorage } = require(path.join(
  __dirname,
  "uploadFile.controller"
));

class baseController {
  index(req, res) {
    try {
      baseModel
        .find({ isDeleted: false })
        .then((bases) => {
          res.json({
            success: true,
            message: "all bases data are retrieved",
            data: bases,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  async create(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "please upload picture file" });
      }
      const response = await uploadImageToFirebaseStorage(req.file, "bases");
      if (!response.success) {
        res.status(500).json({ success: false, message: response.message });
      }
      baseModel
        .create({ ...req.body, picture: response.downloadURL })
        .then((createdBase) =>
          res.json({
            success: true,
            message: "Base is created Successfully",
            data: createdBase,
          })
        )
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
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
            message: "Getting base data succefully",
            data: base,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  update(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        .then((updatedbase) => {
          res.json({
            success: true,
            data: updatedbase,
            message: "base has been Updated successfully",
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors })
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
          { new: true }
        )
        .then((deletedbase) => {
          res.json({
            success: true,
            data: deletedbase,
            message: "base has been deleted successfully",
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
      baseModel
        .findOneAndDelete({ _id: id })
        .then((deletedbase) => {
          orderModel
            .deleteMany({ base: id })
            .then(() =>
              res.json({
                success: true,
                data: deletedbase,
                message: "Base has been deleted Permanently",
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

module.exports = new baseController();
