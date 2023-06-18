const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Schema.Types.Float,
      required: true,
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
