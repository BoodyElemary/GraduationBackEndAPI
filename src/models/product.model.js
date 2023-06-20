const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      float: true,
      required: true,
      min: 0.01
    },
    picture: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    details: {
      brief: {
        type: String,
        required: true,
      },
      nutrition: {
        type: mongoose.SchemaTypes.Mixed,
        required: true,
      },
      ingredients: {
        type: String,
        required: true,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Category"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const productModel = mongoose.model("Product", productSchema)
module.exports = productModel

