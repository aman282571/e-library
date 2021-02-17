var mongoose=require('mongoose')
const struct=new mongoose.Schema({
  bookname:String,
  desc:String,
  email:String,
  amount:Number,
  name:String,
  filename:String
})
const info=mongoose.model('libraryInfos',struct)
module.exports=info