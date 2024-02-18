const  mongoose=require('mongoose')
const Schema = mongoose.Schema
//model
const userSchema = new Schema({
   
    firstname: String,
    lastname: String,
    licenseNo: String,
    DOB:String,
    age: Number,
    car_details: {
      make: String,
      model: String,
      year: String,
      plateno: String
    }
});

const User = mongoose.model('User',userSchema)
mongoose.mode

module.exports=User
