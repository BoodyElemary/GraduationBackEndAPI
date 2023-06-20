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
    isHoliday: {
      type: Boolean,
      default:0,
      required: true,
    },
  },
  { timestamps: true }
);

const voucherModel = mongoose.model("Voucher", voucherSchema)
module.exports = voucherModel