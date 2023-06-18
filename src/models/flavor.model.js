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
    },
  },
  { timestamps: true }
);

const flavorModel = mongoose.model("flavor", flavorSchema)
module.exports = flavorModel
