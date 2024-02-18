const  mongoose=require('mongoose')
const Schema = mongoose.Schema

//model
// const userSchema = new Schema({
//   firstname: String,
//   lastname: String,
//   licenseNo: String,
//   DOB:String,
//   age: Number,
//   car_details: {
//     make: String,
//     model: String,
//     year: String,
//     plateno: String
//   }
// });

//NOTE: removed nesting from schema
//      Reason: how are we going to get nested data from html form ?
//        Currently, we can map form data straight to this model using const newUser = new User(req.body)
//          (as long as field names are the same in form as in this schema)
const userSchema = new Schema({
    firstname: String,
    lastname: String,
    licenseNo: String,
    DOB:String,
    age: Number,
    car_make: String,
    car_model: String,
    car_year: String,
    car_plateno: String
  });

const User = mongoose.model('User',userSchema)

module.exports=User
