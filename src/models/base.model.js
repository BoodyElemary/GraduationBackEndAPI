const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Schema.Types.Float,
      required: true,
    },
    picture: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const baseModel = mongoose.model("base", baseSchema)
module.exports = baseModel
