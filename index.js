// ############ MODULES ##########################

const express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const path = require("path");
const session = require("express-session");

const mongoose = require("mongoose");

const User = require("./models/userModel");

// ------ Connect to database

//mongo db connection string
const mongoCS =
  "mongodb+srv://Sahota:Jattsahota246@Sahota.qutvfqj.mongodb.net/";

try {
  const connection = mongoose.connect(mongoCS);
  // const User = require('./models/userModel')
  console.log("Mongo DB Conncected");
} catch (err) {
  console.log("MongoDB Connecting Error!!");
 
}

// ############ CREATE APPLICATION ##########################
const app = express();

// ############ MIDDLEWARE ##########################

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Gurpal",
    resave: true,
    saveUninitialized: true,
  })
);

// ############ VIEW ENGINE ##########################

app.set("view engine", "ejs");

// ############ ROUTES ##########################

// 1. Dashboard on GET
app.get("/", (req, res) => {
  res.render("dashboard");
});

//2. Login route on GET
app.get("/login", (req, res) => {
  res.render("login");
});

//3. G2 route on GET
app.get("/G2", async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  console.log("User" + user);
  console.log("License Number " + user.licenseNo);
  if (typeof user.licenseNo == "undefined") {
    res.render("G2_Test", user);
  } else {
    res.render("G2_Test", user);
  }
});

//4. G route on GET
app.get("/G", async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({ _id: userId });
  res.render("G_Test",{ result: [user] });
});

//5. Add new user on GET
app.get("/add-new-user", (req, res) => {
  res.render("newUser");
});

//6. SignUp route on GET
app.get("/signup", (req, res) => {
  res.render("signup");
});

//6. Add new user on POST (Route to handle form submission and save user data)

app.post("/add-new-user", async (req, res) => {
  const userId = req.session.userId;
  let user_old = await User.findOneAndUpdate({ _id: userId }, req.body);
  let user_new = await User.findOne({ _id: userId });
  res.render("G2_Test", user_new);
});

//7. Find user on GET (retrieve data from the database)
app.get("/findUser", async (req, res) => {
  console.log(`Finding license number ${req.query.licenseNo} ... `);
  const result = await User.find({ licenseNo: req.query.licenseNo });
  console.log(`Results found: ${result.length}`);
  console.log(`Results: ${result}`);
  res.render("G_Test", { result: result });
});

//8. update car details on GET
app.get("/updateCarDetails", async (req, res) => {
  const result = await User.findOne({ _id: req.query.ID });
  res.render("updateCarDetails", result);
});
//9. Update car details on POST (update database record)
app.post("/updateCarDetails", async (req, res) => {
  console.log(`Request body Id: ${req.body._id}`);
  var update_status = " ";
  const result = await User.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });
  if (typeof result == undefined) {
    update_status = "failed";
  } else {
    update_status = "success";
  }
  result["update_status"] = update_status;

  console.log(`Result ${result}`);
  res.render("updateCarDetails", result);
});

//10. Signup
app.post("/signupUser", async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ username, password, userType });
    await newUser
      .save()
      .then((user) => res.render("login", { user: user }))
      .catch((err) => res.render("login", { error: err }));
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "An error occurred while signing up" });
  }
});

//11.Login
app.post("/loginUser", async (req, res) => {
  const { login_username, login_password } = req.body;
  let userLogin = false;

  // Check if the user exists in the database
  const user = await User.findOne({ username: login_username });
  if (!user) {
    res.locals.error='Unsuccessful';
    res.render("login", req.body);
  } else {
    // Load hash from your password DB.
    bcrypt.compare(login_password, user.password, function (err, result) {
      // result == true
      if (!err) {
        console.log(" Result " + result);
        userLogin = result;
      } else {
        console.log(" Error " + err);
      }

      if (!userLogin) {
        res.render("login", req.body, {error:'Unsuccessful'});
      } else {
        // User is logging in again
        req.session.userId = user._id;
        req.session.userType=user.userType ;
        // if (user.userType === "Driver") {
        //   res.render("dashboard", { user: user });
        // } else {
        //   res.send("userType is not Driver");
        // }
        if (user.userType === "Driver") {
          res.render("dashboard", { user: user });
        } else if(user.userType === "Admin"){
          res.render("appointment", { user: user });
        } else if (user.userType === "Examiner"){
          res.render("", { user: user });
        }else {
           res.send("Accoutn does not exist");
        }


        //show appointment page if user loggd in as Admin
        // if (user.userType === "Admin") {
        //   res.render("appointment", { user: user });
        // } else {
        //   res.send("This Admin account does not exist");
        // }
      }
    });
  }
});

app.listen(4000, () => {
  console.log(`Application link : http://localhost:4000/`);
});


