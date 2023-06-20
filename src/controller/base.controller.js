const path = require("path");
const baseModel = require(path.join(__dirname, "..", "models", "base.model"));

class baseController {
  index(req, res) {
    try {
      baseModel
        .find()
        .then((bases) => {
          res.json({
            success: true,
            message: "all bases data are retrieved",
            data: bases,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  create(req, res) {
    try {
      baseModel
        .create(req.body)
        .then((createdBase) =>
          res.json({
            success: true,
            message: "Base is created Successfully",
            data: createdBase,
          })
        )
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  show(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findOne({ _id: id })
        .then((base) => {
          if (base) {
            res.json({
              success: true,
              message: "Getting base data succefully",
              data: base,
            });
          } else
            res
              .status(404)
              .json({ success: false, message: "base doesn't exist" });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  update(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        .then((updatedbase) => {
          if (updatedbase)
            res.json({
              success: true,
              data: updatedbase,
              message: "base has been Updated successfully",
            });
          else
            res
              .status(404)
              .json({ success: false, message: "base doesn't exist" });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  delete(req, res) {
    try {
      const id = req.params.id;
      baseModel
        .findByIdAndDelete(id)
        .then((deletedbase) => {
          if (deletedbase)
            res.json({
              success: true,
              data: deletedbase,
              message: "base has been deleted successfully",
            });
          else
            res
              .status(404)
              .json({ success: false, message: "base doesn't exist" });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new baseController();
