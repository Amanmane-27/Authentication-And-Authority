const express =require("express");
const app=express();
const UserModel =require("./models/usermodel")
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser') 
const path = require("path");

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({entended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())


app.get('/',(req,res) => {
    res.render('index');
});




app.post("/createUser",  (req,res) => {

    let {username,email,password,age} = req.body
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash) => {
            
            let createdUser = await UserModel.create({
                 username,
                 email,
                 password:hash,
                 age
            })

            let token =  jwt.sign({email},"secret");
            res.cookie('token',token)
            res.send(createdUser)
        })
    })

})

app.get('/login',function(req,res){
     res.render('login')
})

app.post('/login',async function(req,res){
 let user=  await UserModel.findOne({email:req.body.email})
 if(!user) return res.send('something is wrong')
console.log(user.password,req.body.password)
 bcrypt.compare(req.body.password,user.password,function(err,result){
if(result) res.send("User Loged in successfully")
    else res.send('sothing went wrong')
  console.log(result)
 })
});

app.get('/logout',function(req,res) {
     res.cookie('token','')
     res.redirect("/")
})

app.listen(3000)