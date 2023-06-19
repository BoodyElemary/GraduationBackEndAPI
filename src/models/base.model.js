const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      float: true,
      required: true,
      min: 0.01
    },
    picture: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const baseModel = mongoose.model("Base", baseSchema)
module.exports = baseModel
