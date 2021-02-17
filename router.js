var express=require('express')
var bodyParser=require('body-parser')
var User=require('./model/libraryusers')
router=express.Router()


  

//static files
router.use('/cssfiles',express.static(__dirname +'/cssfiles'))

//bodyparser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//login signin getrequest
router.get('/',(req,res)=>{res.render('index')})
router.get('/login',(req,res)=>{res.render('login')})
//postrequests
router.post('/register',urlencodedParser,(req,res)=>{
   
    const {name,email,password}=req.body;
    User.findOne({name:name},(err,user)=>{
        if(user)
      {   const error="Already Registered,  Login please !!"
         res.render('index',{error:error})
      }
        else{
        const newuser=new User({name:name,email:email,password:password})
        newuser.save((err,data)=>{
        if(err)
        console.log(err)
        res.render('login')
       
        })
      }})})
    



router.post('/login', urlencodedParser,(req,res)=>{
  const {name,password}=req.body;
  User.findOne({name:name},(err,user)=>{
    if(user!=null)
    {
      if(user.password==password)
      {
        
        
            res.render('homepage',{user:user})
       
      }
      else{
        const msg="Wrong Password !!"
      res.render('login',{msg:msg})
      }

    }
    
    else{
      const msg="Please Sign Up First!!"
      res.render('login',{msg:msg})

    }
  })
})
module.exports=router