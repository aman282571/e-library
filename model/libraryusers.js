var mongoose=require('mongoose')
var user= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
       default:Date.now
    }

})
var libraryusers=mongoose.model('Users',user)
module.exports=libraryusers;