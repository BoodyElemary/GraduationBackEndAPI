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
      required: true,
      min: 0.01
    },
    picture: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const baseModel = mongoose.model("Base", baseSchema)
module.exports = baseModel
