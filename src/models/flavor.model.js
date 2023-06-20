const mongoose = require("mongoose");

const flavorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      float: true,
      required: true,
      min: 0.01
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const flavorModel = mongoose.model("Flavor", flavorSchema)
module.exports = flavorModel
