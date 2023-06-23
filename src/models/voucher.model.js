const mongoose = require("mongoose");
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: 'Voucher Expired',
      },

    },
    status: {
      type: String,
      enum: ['applied', 'expired'],
      default: 'applied',
    },
    isDeleted:{
      type: Boolean,
      default:false,
    },createdAt: {
      type: Date,
      default: new Date().toLocaleString("en-US", {
        timeZone: "Indian/Maldives",
      }),
    },
    updatedAt: {
      type: Date,
      default: new Date().toLocaleString("en-US", {
        timeZone: "Indian/Maldives",
      }),
    },
  },
  // { timestamps: true }
);

const voucherModel = mongoose.model("Voucher", voucherSchema)
module.exports = voucherModel