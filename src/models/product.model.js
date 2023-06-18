const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0.01
    },
    picture: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'unavailable'],
      default: 'available',
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
      ref:"Category"
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema)
module.exports = productModel
