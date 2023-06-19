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
          const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{9,12}$/gm;
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
