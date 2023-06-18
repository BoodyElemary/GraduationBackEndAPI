const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Schema.Types.Float,
      required: true,
    },
    picture: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    details: {
      prief: {
        type: String,
        required: true
      },
      nutrition:{
        type: String,
        required: true
      },
      ingredients:{
        type: String,
      required: true
      }
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"category"
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema)
module.exports = productModel
