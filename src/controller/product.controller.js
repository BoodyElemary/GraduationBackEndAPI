const path = require('path');
const productModel = require(path.join(
  __dirname,
  '..',
  'models',
  'product.model',
));
const orderModel = require(path.join(__dirname, '..', 'models', 'order.model'));
const {
  uploadImageToFirebaseStorage,
  deleteImageFromFirebaseStorage,
} = require(path.join(__dirname, 'uploadFile.controller'));
const jwt = require('jsonwebtoken');

class productController {
  index(req, res) {
    try {
      productModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .populate('category')
        .then((products) => {
          res.json({
            success: true,
            message: 'all products data are retrieved',
            data: products,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
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
          .json({ success: false, message: 'please upload picture file' });
      }
      const response = await uploadImageToFirebaseStorage(req.file, 'products');
      if (!response.success) {
        res.status(500).json({ success: false, message: response.message });
      }
      productModel
        .create({ ...req.body, picture: response.downloadURL })
        .then((createdProduct) =>
          res.json({
            success: true,
            message: 'product is created Successfully',
            data: createdProduct,
          }),
        )
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  show(req, res) {
    try {
      const id = req.params.id;
      productModel
        .findOne({ _id: id })
        .populate('category')
        .then((product) => {
          res.json({
            success: true,
            message: 'Getting product data succefully',
            data: product,
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
      let product = await productModel.findOne({ _id: id });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "product doesn't exist" });
      }
      if (req.file) {
        const response = await uploadImageToFirebaseStorage(
          req.file,
          'products',
        );

        if (!response.success) {
          return res
            .status(500)
            .json({ success: false, message: response.message });
        }
        entryData = { ...req.body, picture: response.downloadURL };
        await deleteImageFromFirebaseStorage(product.picture);
      }
      productModel
        .findOneAndUpdate({ _id: id }, { $set: entryData }, { new: true })
        .then((updatedProduct) => {
          res.json({
            success: true,
            data: updatedProduct,
            message: 'product has been Updated successfully',
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
      productModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { isDeleted: true } },
          { new: true },
        )
        .then((deletedProduct) => {
          res.json({
            success: true,
            data: deletedProduct,
            message: 'product has been deleted successfully',
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  hardDelete(req, res) {
    try {
      const id = req.params.id;
      productModel
        .findOneAndDelete({ _id: id })
        .then(async (deletedProduct) => {
          await deleteImageFromFirebaseStorage(deletedProduct.picture);
          orderModel
            .deleteMany({ 'orderedProducts.product': id })
            .then(() =>
              res.json({
                success: true,
                data: deletedProduct,
                message: 'Product has been deleted Permanently',
              }),
            )
            .catch((error) =>
              res.status(500).json({ success: false, message: error.errors }),
            );
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.errors }),
        );
    } catch (error) {
      res.status(500).json({ success: false, message: error.errors });
    }
  }

  async editStoreStatus(req, res) {
    try {
      const id = req.params.id;

      // Verify and decode the token to get the storeId
      const token = req.headers.authorization;
      // Verify the token and extract the id
      const decoded = jwt.verify(
        token.replace('Bearer ', ''),
        process.env.SECRET_KEY,
      );
      const storeId = decoded.storeId;
      const { availability } = req.body;

      let product = await productModel.findOne({ _id: id });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product doesn't exist" });
      }

      // Find the index of the store status in the product's status array
      const storeIndex = product.status.findIndex(
        (status) => status.store.toString() === storeId,
      );

      // If the store status exists, update its availability
      if (storeIndex !== -1) {
        product.status[storeIndex].availability = availability;
      } else {
        // If the store status doesn't exist, create a new status object and push it to the array
        product.status.push({ store: storeId, availability });
      }

      // Save the updated product
      const updatedProduct = await product.save();

      return res.json({
        success: true,
        data: updatedProduct,
        message: 'Product status has been updated successfully',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = new productController();
