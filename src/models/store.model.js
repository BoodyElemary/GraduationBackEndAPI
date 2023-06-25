const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // hero Image
    heroImage: {
      type: String,
      required: true,
    },
    map: {
      type: String,
      required: true,
    },
    pageImage: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,

      // validate: {
      //   validator: function(v) {
      //     const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/gm;
      //     return phoneRegex.test(v);
      //   },
      //   message: 'Invalid phone number',
      // }
    },
    // status: {
    //   type: String,
    //   enum: ['opened', 'closed'],
    //   default: 'opened',
    // },
    // isHoliday: {
    //   type: Boolean,
    //   default:0,
    //   required: true,
    // },
    workingHours: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
          unique: true,
        },
        startHour: {
          type: Number,
          required: true,
          min: 0,
          max: 24,
        },
        endHour: {
          type: Number,
          required: true,
          min: 0,
          max: 24,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
  // Define a virtual property for the status field
  // calculate status depends on Working Hours
  storeSchema.virtual('status').get(function() {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
    console.log(dayOfWeek);
    const workingHours = this.workingHours.find(working => working.day === dayOfWeek);
    console.log("Ana hena Status");

    if (!workingHours) {
      return 'closed';
    } 
    const currentHour = now.getHours();
    if (currentHour < workingHours.startHour || currentHour >= workingHours.endHour) {
      return 'closed';
    }
    return 'opened';
  });
  
  // Define a virtual property for the isHoliday field
  // calculate holiday days depends on working Hours
  storeSchema.virtual('isHoliday').get(function() {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
    const workingHours = this.workingHours.find(working => working.day === dayOfWeek);
    console.log(workingHours);
    console.log("Ana hena Holiday");
    if (!workingHours) {
      return true;
    }
    return false;
  });


// Define a virtual property for the isHoliday field
// calculate holiday days depends on working Hours
storeSchema.virtual("isHoliday").get(function () {
  const now = new Date();
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const workingHours = this.workingHours.find(
    (working) => working.day === dayOfWeek
  );
  if (!workingHours) {
    return true;
  }
  return false;
});

// Set the toObject and toJSON options to include virtuals
storeSchema.set("toObject", { virtuals: true });
storeSchema.set("toJSON", { virtuals: true });
const storeModel = mongoose.model("Store", storeSchema);
module.exports = storeModel;
