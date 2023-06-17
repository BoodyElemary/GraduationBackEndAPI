const path = require('path');
const mongoose = require('mongoose');

const passwordHandle = require(path.join(
  __dirname,
  '..',
  'util',
  'password-handle',
));

const userSchema = new mongoose.Schema({
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
  voucherList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
      trim: true,
    },
  ],
});

userSchema.pre('save', async () => {
  if (this.isNew || this.isModified('password'))
    try {
      this.password = await passwordHandle.hash(this.password);
    } catch (error) {
      next(error);
    }
  next();
});

mongoose.model('Customer', userSchema);
