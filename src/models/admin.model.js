const mongoose = require("mongoose");
const path = require("path");

const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  { timestamps: true }
);
adminSchema.index({ fullName: "text" });

adminSchema.pre("save", async () => {
  if (this.isNew || this.isModified("password"))
    try {
      this.password = await passwordHandle.hash(this.password);
    } catch (error) {
      next(error);
    }
  next();
});
mongoose.model("Admin", adminSchema);
