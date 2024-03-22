const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  userType: {
    type: String,
    enum: ["Driver", "Examiner", "Admin"],
    required: true,
    default: "Driver",
  },
  firstname: String,
  lastname: String,
  licenseNo: String,
  DOB: String,
  age: Number,
  car_make: String,
  car_model: String,
  car_year: String,
  car_plateno: String,
});


userSchema.pre("save", async function (next) {
  const user = this;
  // Hash password before saving
  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }

  // Hash licenseNo before saving
  if (user.isModified("licenseNo")) {
    const hash = await bcrypt.hash(user.licenseNo, 10);
    user.licenseNo= hash;
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;


// if (!user.isModified("password")) return next();
//   const hash = await bcrypt.hash(user.password, 10);
//   user.password = hash;
//   next();
// }
