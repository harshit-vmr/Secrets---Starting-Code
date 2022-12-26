//Import Module(Start)
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");
//Import Module(End)



//Activate Modules(Start)
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
//Activate Modules(End)



//Connect Database(Start)
const dbName = "userDB";
const uri = "mongodb+srv://harshvmr:Harsh123@cluster0.uelqnum.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.set("strictQuery", true);
mongoose.connect(uri,connectionParams).then(()=>{
  console.log("conneted to db");
}).catch((e)=> {
  console.log("error", e);
});
//Connect Database(End)




const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
});



const User = new mongoose.model("User",userSchema);






//Handle http request(Start)
app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const email = req.body.username;
    const password = md5(req.body.password);
    const newUser = new User({
        email: email,
        password: password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
    const email = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: email},function(err,foundUser){
        if(err){
            console.log("err");
        }
        else{
            if(foundUser){
                if(foundUser.password == password){
                    res.render("secrets");
                }
            }
        }
    });
});
//Handle http request(End)













app.listen(3000,function(){
    console.log("Server running on Port 3000");
});
