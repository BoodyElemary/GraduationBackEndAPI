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
        message: 'Pickup time must be in the future',
      },
  
    },
    status: {
      type: String,
      enum: ['opened', 'closed'],
      default: 'opened',
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
