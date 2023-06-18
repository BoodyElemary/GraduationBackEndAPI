const mongoose = require("mongoose");

const toppingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Schema.Types.Float,
      required: true,
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const toppingModel = mongoose.model("topping", toppingSchema)
module.exports = toppingModel
