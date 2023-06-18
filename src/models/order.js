const path = require('path');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    pickUpTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: 'Pickup time must be in the future',
      },
    },

    arrivalTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now() && value > this.pickupTime;
        },
        message: 'Arrival time must be after pickup time and in the future',
      },
    },

    status: {
      type: String,
      enum: ['pending', 'preparing', 'delivered'],
      default: 'pending',
    },

    // Regex is for security purposes
    note: { type: String, match: /^[\w\s.,!?()-]*$/ },

    orderedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    orderedCustomizedProducts: [
      {
        // The drink itself
        base: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Base',
          required: true,
        },
        flavor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Flavor',
          required: true,
        },
        toppings: [
          {
            topping: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Topping',
              required: true,
            },
            quantity: { type: Number, required: true },
          },
        ],
        // Quantity of the customized drinks
        quantity: { type: Number, required: true },
      },
    ],

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },

    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },

    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

mongoose.model('Order', orderSchema);
