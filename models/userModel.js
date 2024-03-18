const  mongoose=require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema


const userSchema = new Schema({
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
    username:String,
    password:String,
    userType: { type: String, enum: ['Driver', 'Examiner', 'Admin'], required: true, default: 'Driver' },
    firstname: String,
    lastname: String,
    licenseNo: String,
    DOB:String,
    age: Number,
    car_make: String,
    car_model: String,
    car_year: String,
    car_plateno: String
    // userType: { type: String, enum: ['Driver', 'Examiner', 'Admin'], required: true, default: 'Driver' },
    // firstname: { type: String, default: 'John' },
    // lastname: { type: String, default: 'Doe' },
    // licenseNo: { type: String, default: 'A12345' },
    // car_make: { type: String, default: 'Toyota' },
    // car_model: { type: String, default: 'Corolla' },
    // car_year: { type: String, default: '2022' },
    // car_plateno: { type: String, default: 'XYZ123' }
  });

  // Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

const User = mongoose.model('User',userSchema)

module.exports=User
