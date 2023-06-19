const mongoose = require('mongoose');

const toppingTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01
    }
  },
  { timestamps: true },
);

const toppingTypeModel = mongoose.model('ToppingType', toppingTypeSchema);
module.exports = toppingTypeModel;
