const mongoose = require("mongoose");
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      float: true,
      required: true,
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
  },
  { timestamps: true }
);

const voucherModel = mongoose.model("Voucher", voucherSchema);
module.exports = voucherModel;
