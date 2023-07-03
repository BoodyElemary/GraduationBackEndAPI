const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      unique: true,
    },

    toppingType: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ToppingType",
      required: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const toppingModel = mongoose.model('Topping', toppingSchema);
module.exports = toppingModel;
