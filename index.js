// ############ MODULES ##########################


const express = require('express')     
const ejs = require('ejs')              
const bcrypt = require('bcryptjs');
const path = require('path')


const mongoose=require('mongoose')


const User=require('./models/userModel')



// ------ Connect to database 

//mongo db connection string
const mongoCS='mongodb+srv://Sahota:Jattsahota246@Sahota.qutvfqj.mongodb.net/';

try {
    const connection = mongoose.connect(mongoCS)
    // const User = require('./models/userModel')
    console.log("Mongo DB Conncected")
} catch(err){
    console.log("MongoDB Connecting Error!!")
    //TODO: If db is not connected, should the program go further or end here ?
}

// ############ CREATE APPLICATION ########################## 
const app = express()      

// ############ MIDDLEWARE ##########################

app.use(express.static('public'))               
app.use(express.json())                         
app.use(express.urlencoded({extended:true}))    

// ############ VIEW ENGINE ##########################

app.set('view engine','ejs')    


// ############ ROUTES ##########################

// 1. Dashboard on GET
app.get('/',(req,res)=>{
    res.render('dashboard')
});

//2. Login route on GET
app.get('/login',(req,res)=>{
    res.render('login')
 });



 //3. G2 route on GET
app.get('/G2',(req,res)=>{
    res.render('G2_Test')}) ;

//4. G route on GET
app.get('/G',(req,res)=>{
    res.render('G_Test')
});

//5. Add new user on GET

app.get('/add-new-user',(req,res)=>{
 res.render('newUser')
});

//6. SignUp route on GET
app.get('/signup',(req,res)=>{
    res.render('signup')
 });


//6. Add new user on POST (Route to handle form submission and save user data)

    app.post('/add-new-user', async (req, res) => {
    try {
        
        const newUser = new User(req.body);


        await newUser.save()
            .then(user => res.render('G2_Test', {user: user}))  
            .catch(err => res.render('G2_Test', {error: err}))  

    } catch (error) {
        
        console.error('Error adding user:', error);
  
        res.render('G2_Test', {error: error})   
    }
});


//7. Find user on GET (retrieve data from the database)
app.get('/findUser',async (req,res)=>{
    
    console.log(`Finding license number ${req.query.licenseNo} ... `)
    const result= await User.find({  licenseNo: req.query.licenseNo });
    console.log(`Results found: ${result.length}`)
    console.log(`Results: ${result}`)

    res.render('G_Test',{result: result})
    }
  
);


//8. update car details on GET
app.get('/updateCarDetails', async (req, res) => {
    const result= await User.findOne({  _id: req.query.ID });
    res.render('updateCarDetails', result)
})
//9. Update car details on POST (update database record)
app.post('/updateCarDetails', async (req, res) => {
    console.log(`Request body Id: ${req.body._id}`)
    var update_status=" "
    const result= await User.findByIdAndUpdate(req.body._id, req.body , {new: true})
    if(typeof(result) == undefined){
        update_status="failed"
    }else{
            update_status="success"
    }
    result["update_status"]=update_status;
   
    console.log(`Result ${result}`)
    res.render('updateCarDetails', result)
})

//10. Signup
app.post('/signupUser', async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password, userType});
        await newUser.save()
        // res.status(201).json({ message: 'User created successfully' });
        .then(user => res.render('login', {user: user}))  
            .catch(err => res.render('login', {error: err}))  
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'An error occurred while signing up' });
    }
});

//11.Login
app.post('/loginUser', async (req, res) => {
    const { login_username, login_password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username: login_username, password: login_password });

    if (!user) {
        // res.send('unsuccesful')
        
        res.render('login', {username:login_username});
    } else {
        // User is logging in again
      
        // res.render('dashboard', { user });
        res.send('Login Successfull');
    }
   
});

app.listen(4000,()=>{
    console.log(`Application link : http://localhost:4000/`)
})
