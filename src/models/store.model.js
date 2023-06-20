const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/gm;
          return phoneRegex.test(v);
        },
        message: 'Invalid phone number',
      }
  
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

const storeModel = mongoose.model("Store", storeSchema)
module.exports = storeModel
