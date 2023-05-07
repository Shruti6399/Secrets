//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs= require("ejs")
const bodyPareser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app= express()
app.set('view engine' , 'ejs')
app.use(bodyPareser.urlencoded({
    extended : true
}))

mongoose.connect("mongodb://127.0.0.1:27017/Webusers" , {useUnifiedTopology :true , useNewUrlParser : true})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})


userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ["password"]} )
const User = mongoose.model("User" , userSchema);

app.get("/" , function(req, res){
    res.render("home")
})

app.get("/login" , function(req, res){
    res.render("login")
})

app.get("/register" , function(req, res){
    res.render("register")
})

app.post("/register" , function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })

    newUser.save()
    .then(users=>{
        console.log("Sucessfully added user to the db")
        res.render("secrets")
    })
    .catch(err=>{
        console.log(err)
        res.send("Error 404!! Please try again later")
    })
})

app.post("/login" , function(req, res){
    var e = req.body.username
    var p = req.body.password

    User.findOne({email : e})
    .then(user=>{
        if(user.password == p){
            console.log("User found")
            res.send(user)
        }
        else{
            res.send("Incorrect Password")
        }
        
    })
    .catch(err=>{
        console.log(err)
        res.send("Access not granted")
    })
})

app.listen("3000" , function(){
    console.log("Server Started")
})