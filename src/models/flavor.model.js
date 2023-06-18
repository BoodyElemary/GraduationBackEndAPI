const mongoose = require("mongoose");

const flavorSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const flavorModel = mongoose.model("Flavor", flavorSchema)
module.exports = flavorModel
