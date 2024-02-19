// ############ MODULES ##########################

/*Use Express web framework 
    Home: https://expressjs.com/
    Getting started:  https://expressjs.com/en/starter/installing.html
    Guide: https://expressjs.com/en/guide/routing.html 
    API reference: https://expressjs.com/en/4x/api.html)
    Advanced topics: https://expressjs.com/en/advanced/developing-template-engines.html
*/
const express = require('express')      //needed for express server and view engine
const ejs = require('ejs')              //use ejs view engine, express has multiple view engines: ejs, hbs, pug, hjs, jade, etc 

/* Path provides utilities for working with file and directory paths. 
    https://nodejs.org/api/path.html
*/
const path = require('path')

/* Object modeling tool for MongoDB
    https://mongoosejs.com/
*/
const mongoose=require('mongoose')


const User=require('./models/userModel')

// ############ END MODULES ##########################

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
const app = express()       //create new instance for express

// ############ MIDDLEWARE ##########################
//  Middleware are functions that run between client request and server response. 
//  Has access to req, res and next objects (calling next() sends control to next middleware or user defined handler)
//  Multiple middleware functions can be chained together. 
app.use(express.static('public'))               //to serve static webpages (.html) and resources like images, css and js
app.use(express.json())                         //to read/send json
app.use(express.urlencoded({extended:true}))    //to view data from request body (in post requests)

// ############ VIEW ENGINE ##########################
//  ejs is one of the view engines provided by express
//  Data can be sent to views key value pairs, and values can accessed in view engine using <%= key %>
//  Other control structures can be be used in view using pair of <% and %>
//      example: <% users.foreach( (user) => ) {%> user.name <%} ) %>
app.set('view engine','ejs')    


// ############ ROUTES ##########################
// Routes are based on HTTP verbs: GET, POST, PUT, DELETE
//      more information on http verbs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//
// NOTES:
//  1. Routes are checked from top to bottom, so if two routes match similar url pattern,
//      the route defined first in this file will be executed
//  2. Routes are rendering views with res.render('<view_name>')
//       so whatever view_name is called from render, must exist in views folder

// 1. Dashboard on GET
//      This is default route, represented by /, also called home page or landing page of web application
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
//TODO: this route should be disabled, since user data is collected from G2, 
//      G2 should be routed using GET.
//      When user fills form on G2 and clicks Submit, that form should be pointed
//          to this route via POST, and if user is added successfully, message should be shown 
//          to user and form should be blanked out to help with next user 
app.get('/add-new-user',(req,res)=>{
 res.render('newUser')
});


//6. Add new user on POST (Route to handle form submission and save user data)
//TODO: Few outcomes from this function:
//  1. Input data is not valid, so we don't even want to try creating record in database
//      - message needs to be sent to user if some data is invalid
//  2. User creation failed
//      - failure message should be sent to user and data should stay in the form
//  3. User created successfully
//      - success message should be sent to user and form data should be blanked out
app.post('/add-new-user', async (req, res) => {
    try {
        // Create a new user object with data from the request body
        // const newUser = new User({
        //     firstname: req.body.firstname,
        //     lastname: req.body.lastname,
        //     license: req.body.license,
        //     age: req.body.age,
        //     birth: req.body.birth,
        //     cardetails: req.body.cardetails,
        //     model: req.body.model,
        //     platenumber:req.body.platenumber
        // });

        //Since we already created the model, and we have same name fields in our form
        //  , below statement should be able to create instance of User
        //console.log(req.body)
        const newUser = new User(req.body);
        // console.log(newUser.firstname);
// }
        // Save the new user to the database
       // const savedUser = await newUser.save();
        // const savedUser = await newUser.save((err,result) => {
        //     if(err){
        //         //set error message in some variable, add code to view to look for that error message
        //         var error_msg= `Unable to add user ${err}`;
        //         //keep user on same page
        //         res.render(req.path, req.body)
        //     }else{
        //         //set success message in some variable, add code in view to look for success message
        //         alert("User added successfully");
        //         res.render(req.path, req.body)
        //     }

        // }
        // );

        await newUser.save()
            .then(user => res.render('G2_Test', {user: user}))  //user saved to db successfully
            .catch(err => res.render('G2_Test', {error: err}))  //user not saved to db
            
//.catch(err => res.status(400).json("Error: " + err))
        // Respond with a success message
        // res.send('User added successfully: ' + savedUser);
    } catch (error) {
        // some error occurred during creation or save of record
        console.error('Error adding user:', error);
        //res.status(500).send(`Error adding user: ${error}`);
        res.render('G2_Test', {error: error})     //send control back to form page with error object
    }

    //console.log("New User"+newUSer)

    //save to mongo db
// newUser.save(newUser).then(data=>{
//     res.redirect('/')
// }).catch(err=>{
//     res.status(401).send({message:err.message})
// })



});


// OLD CODE
// app.post('/add-new-user',async (req, res) => {
//     try {

//         console.log("reqbody" +  req.body);
//         // Create a new user object with data from the request body

//         const newUser = new User({
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             license: req.body.license,
//             age: req.body.age,
//             birth: req.body.birth,
//             cardetails: req.body.cardetails,
//             model: req.body.model,
//             platenumber:req.body.platenumber
//         });
//         console.log("New User firstname" + newUser.firstname);

//         // Save the new user to the database
//         const savedUser = await newUser.save();

//         // Respond with a success message
//         res.send('User added successfully: ' + savedUser);
//         // res.render('newUser');
//     } catch (error) {
//         // Handle errors
//         console.error('Error adding user:', error);
//         res.status(500).send('Error adding user');
//     }

//     console.log("New User"+newUSer)

//     //save to mongo db
//     newUser.save(newUser).then(data=>{
//         res.redirect('/')
//     }).catch(err=>{
//         res.status(401).send({message:err.message})
//     })
//     } 
// );


//7. Find user on GET (retrieve data from the database)
app.get('/findUser',async (req,res)=>{
    //get licenseno from request
    //NOTE: when getting query param, case of param name has to match 
    //      (e.g. licenseno is not same as licenseNo)
    
    
    //TODO: can we use req.body here also instead of firstname :"asd" ?
    //TODO: may be we will need new instance of user, like:
    //  const result= await User.find(new User(req.body))         
    
    console.log(`Finding license number ${req.query.licenseNo} ... `)
    //approach 1 - reqad query string into JSON object, and use that object to query
    //var queryparam = {licenseNo : req.query.licenseNo}
    //const result= await User.find(queryparam);

    //approach 2 - read parameter from query string into variable, then use that variable to find
    //var licenseno = req.query.licenseNo
    //const result= await User.find({  licenseNo: licenseno });
    
    //approach 3 - directly use query string read within find 
    const result= await User.find({  licenseNo: req.query.licenseNo });

    //const result = await User.find({firstname : 'Harpreet'})
    console.log(`Results found: ${result.length}`)
    console.log(`Results: ${result}`)

    res.render('G_Test',{result: result})
    }
  
);

// app.get('/updateCarDetails',async (req,res) =>{
//     console.log(req.query.ID)
//     const result= await User.findOne({  _id: req.query.ID });
//     // console.log(result);
//     console.log();
//     // res.render('updateCarDetails',{firstname : "Gurpal"});
//     res.render('updateCarDetails',result);


// });
   
// app.put('/updateCarDetails',(req,res) =>{

//     console.log(req.body);


// })
//8. update car details on GET
app.get('/updateCarDetails', async (req, res) => {
    const result= await User.findOne({  _id: req.query.ID });
    res.render('updateCarDetails', result)
})
//9. Update car details on POST (update database record)
app.post('/updateCarDetails', async (req, res) => {
    console.log(`Request body Id: ${req.body._id}`)
    var update_status=" "
    //have to send {new: true} to get back new record after update
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



//  async (req, res) => {
//     try {
//         // Create a new user object with data from the request body
//         const newUser = new User({
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             license: req.body.license,
//             age: req.body.age,
//             birth: req.body.birth,
//             cardetails: req.body.cardetails,
//             model: req.body.model,
//             platenumber:req.body.platenumber
//         });
//         console.log(newUser.firstname);
// // }
//         // Save the new user to the database
//         const savedUser = await newUser.save();

//         // Respond with a success message
//         res.send('User added successfully: ' + savedUser);
//     } catch (error) {
//         // Handle errors
//         console.error('Error adding user:', error);
//         res.status(500).send('Error adding user');
//     }

//     console.log("New User"+newUSer)

//     //save to mongo db
// newUser.save(newUser).then(data=>{
//     res.redirect('/')
// }).catch(err=>{
//     res.status(401).send({message:err.message})
// })
// }


app.listen(4000,()=>{
    console.log(`Application link : http://localhost:4000/`)
})
