const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      float: true,
      required: true,
      min: 0.01
    },

    toppings: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const toppingModel = mongoose.model('Topping', toppingSchema);
module.exports = toppingModel;
