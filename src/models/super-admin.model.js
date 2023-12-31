const path = require("path");
const mongoose = require("mongoose");
const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));

const superAdminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);
superAdminSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      this.password = await passwordHandle.hash(this.password);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  }
  next();
});
mongoose.model("SuperAdmin", superAdminSchema);
