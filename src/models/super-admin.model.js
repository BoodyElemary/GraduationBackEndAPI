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
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
superAdminSchema.pre("save", async () => {
  if (this.isNew || this.isModified("password"))
    try {
      this.password = await passwordHandle.hash(this.password);
    } catch (error) {
      next(error);
    }
  next();
});
mongoose.model("SuperAdmin", superAdminSchema);
