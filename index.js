//Modules
const express = require('express') 
const path = require('path')
const mongoose=require('mongoose')
const ejs = require('ejs')
const User=require('./models/userModel')

//mongo db connection string
const mongoCS='mongodb+srv://Sahota:Jattsahota246@Sahota.qutvfqj.mongodb.net/';



try {
    const connection = mongoose.connect(mongoCS)
    // const User = require('./models/userModel')
    console.log("Mongo DB Conncected")
} catch(err){
    console.log("MongoDB Connecting Error!!")
}

// Creating Application 
const app = express() 

// Mid ware
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))



// 1. Dashboard
app.get('/',(req,res)=>{
    res.render('dashboard')
});

//2. Login route
app.get('/login',(req,res)=>{
    res.render('login')
 });

 //3. G2 route
app.get('/G2',(req,res)=>{
    res.render('G2_Test')}) ;

//4. G route
app.get('/G',(req,res)=>{
    res.render('G_Test')
});

app.get('/add-new-user',(req,res)=>{
 res.render('newUser')
});




////////////////////////saving data to Sahota cluster//////////////////////////////////////

// Route to handle form submission and save user data
app.post('/add-new-user', async (req, res) => {
    try {
        // Create a new user object with data from the request body
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            license: req.body.license,
            age: req.body.age,
            birth: req.body.birth,
            cardetails: req.body.cardetails,
            model: req.body.model,
            platenumber:req.body.platenumber
        });
        // console.log(newUser.firstname);
// }
        // Save the new user to the database
       // const savedUser = await newUser.save();
        const savedUser = await newUser.save((err,result) => {
            if(err){
                alert("Unable to add user " + err);
            }else{
                alert("User added successfully");
                res.render('dashboard')
            }

        }
        );

        // Respond with a success message
        // res.send('User added successfully: ' + savedUser);
    } catch (error) {
        // Handle errors
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }

    //console.log("New User"+newUSer)

    //save to mongo db
// newUser.save(newUser).then(data=>{
//     res.redirect('/')
// }).catch(err=>{
//     res.status(401).send({message:err.message})
// })



});






app.listen(4000,()=>{
    console.log(`Application link : http://localhost:4000/`)
})


app.post('/add-new-user',async (req, res) => {
    try {

        console.log("reqbody" +  req.body);
        // Create a new user object with data from the request body

        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            license: req.body.license,
            age: req.body.age,
            birth: req.body.birth,
            cardetails: req.body.cardetails,
            model: req.body.model,
            platenumber:req.body.platenumber
        });
        console.log("New User firstname" + newUser.firstname);

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Respond with a success message
        res.send('User added successfully: ' + savedUser);
        // res.render('newUser');
    } catch (error) {
        // Handle errors
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }

    console.log("New User"+newUSer)

    //save to mongo db
    newUser.save(newUser).then(data=>{
        res.redirect('/')
    }).catch(err=>{
        res.status(401).send({message:err.message})
    })
    } 
);


//retrieve data form the database

app.get('/findUser',async (req,res)=>{
    // res.render('newUser')
    const result= await User.find({
    
        firstname: "asd"
        
    });
    var str=" ";
    const found = result.length;
    // alert("Found " + found + " Records");
    
    for (const doc of result) {
         str+=doc;
       
    }
    // res.send(" REcords= "+ found + " <br> " +  str );

    res.render('G_Test',{data: str})
    }
  
);
   



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
