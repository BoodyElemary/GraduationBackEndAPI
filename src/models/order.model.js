const path = require("path");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  pickUpTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Pickup time must be in the future",
    },
  },

  arrivalTime: {
    type: Date,
    default: function () {
      return this.pickUpTime;
    },
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Arrival time must be after pickup time and in the future",
    },
  },

  status: {
    type: String,
    enum: ["pending", "preparing", "delivered","canceled"],
    default: "pending",
  },

  // Regex is for security purposes
  note: { type: String, maxlength: 200, match: /^[\w\s.,!?()-]*$/ },

  orderedProducts: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value > 0;
          },
          message: "Quantity must be greater than 0",
        },
      },
    },
  ],

  orderedCustomizedProducts: [
    {
      // The drink itself
      base: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Base",
        required: true,
      },
      flavor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flavor",
        required: true,
      },
      toppings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Topping",
        },
      ],
      // Quantity of the customized drinks
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value > 0;
          },
          message: "Quantity must be greater than 0",
        },
      },
    },
  ],

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },

  voucher: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },

  subTotal: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
    required: true,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Subtotal amount must be greater than 0",
    },
  },
  discount: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  totalPrice: {
    type: Number,
    set: (value) => parseFloat(value.toFixed(2)),
    required: true,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Total price must be greater than 0",
    },
  },
},

{timestamps: true}
);

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel
