const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    
    topping: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ToppingType",
      required: true
    }
  },
  { timestamps: true },
);

const toppingModel = mongoose.model('Topping', toppingSchema);
module.exports = toppingModel;
