const mongoose = require("mongoose");
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0.0,
      max: 1,
    },
    expireDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Voucher Expired",
      },
    },
    status: {
      type: String,
      enum: ["applied", "expired"],
      default: "applied",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const voucherModel = mongoose.model("Voucher", voucherSchema);
module.exports = voucherModel;
