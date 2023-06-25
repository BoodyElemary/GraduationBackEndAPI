const mongoose = require("mongoose");


module.exports = async (callback) => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Cloud db server connected .....");
    await callback();
  } catch (err) {
    console.log(err);
  }
};
