const appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Appointment = require("./models/appointmentModel");

const addNewUser =  async(req,res) => {
    const userId = req.session.userId;
    let user_old = await User.findOneAndUpdate({ _id: userId }, req.body);
    let user_new = await User.findOne({ _id: userId });
    res.render("G2_Test",  {user : user_new});
}

const findUser = async(req,res) => {
    console.log(`Finding license number ${req.query.licenseNo} ... `);
    const result = await User.find({ licenseNo: req.query.licenseNo });
    console.log(`Results found: ${result.length}`);
    console.log(`Results: ${result}`);
    res.render("G_Test", { result: result });
}

const signUp = async(req,res) => {
    try {
        const { username, password, userType } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }
    
        const newUser = new User({ username, password, userType });
        await newUser
          .save()
          .then((user) => res.render("login", { user: user ,isNewUser:true}))
          .catch((err) => res.render("login", { error: err,isNewUser:false}));
          
      } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "An error occurred while signing up" });
      }
}

const loginUser = async(req,res) => {
    const { login_username, login_password } = req.body;
  let userLogin = false;
  // Check if the user exists in the database
  const user = await User.findOne({ username: login_username });
  if (!user) {
    res.locals.error = "Unsuccessful";
    res.render("login", req.body);
  } else {
    // Load hash from your password DB.
    bcrypt.compare(login_password, user.password, async function (err, result) {
      if (!err) {
        console.log(" Result " + result);
        userLogin = result;
      } else {
        console.log(" Error " + err);
      }
      if (!userLogin) {
        res.render("login", { ...req.body, error: "Unsuccessful" });
      } else {
        // User is logging in again
        req.session.userId = user._id;
        req.session.userType = user.userType;
        const selectedDate =
          req.query.date || new Date().toISOString().split("T")[0];
        const appointments = await Appointment.find({ date: selectedDate });
        const bookedSlots =
        appointments.map((appointment) => appointment.time) || [];
        console.log("Available slots:" + bookedSlots);
        if (user.userType === "Driver") {
          res.render("dashboard", { user: user });
        } else if (user.userType === "Admin") {
          console.log(user.userType);
          res.render("appointment", { user: user, bookedSlots, selectedDate });
        } else if (user.userType === "Examiner") {
          res.render("", { user: user });
        } else {
          res.send("Account does not exist");
        }
      }
    });
  }
}



module.exports =  {
    addNewUser,
    findUser,
    signUp,
    loginUser

};
