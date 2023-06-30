const path = require("path");
const mongoose = require("mongoose");

const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    customerOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
    voucherList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
      },
    ],
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      this.password = await passwordHandle.hash(this.password);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  }
  next();
});

mongoose.model("Customer", customerSchema);
