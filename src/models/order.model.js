const path = require("path");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now() && value > this.pickupTime;
        },
        message: "Arrival time must be after pickup time and in the future",
      },
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "delivered"],
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
            topping: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Topping",
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

    totalPrice: {
      type: Number,
      float: true,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Total price must be greater than 0",
      },
    },
  },
  { timestamps: true }
);

orderSchema.path("orderedProducts").validate(function (value) {
  const productIds = value.map((item) => item.product.toString());
  return new Set(productIds).size === productIds.length;
}, "Duplicate products not allowed");

orderSchema.path("orderedCustomizedProducts").validate(function (value) {
  const customizedDrinkIds = value.map((item) =>
    [item.base, item.flavor, ...item.toppings.map((t) => t.topping)]
      .map((id) => id.toString())
      .join("-")
  );
  return new Set(customizedDrinkIds).size === customizedDrinkIds.length;
}, "Duplicate customized drinks not allowed");

mongoose.model("Order", orderSchema);
