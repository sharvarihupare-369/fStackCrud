
const mongoose = require("mongoose")
const UserModel = require("./userModel")

const postSchema  = new mongoose.Schema({
   title : {type:String,required:true},
   body  : {type:String,required:true},
   device : {type:String,enum:["Laptop","Tablet","Mobile"],required:true},
   no_of_comments : {type:Number,required:true},
   creator:{type:mongoose.Schema.Types.ObjectId,ref:UserModel},
   name : {type:String}
})

const PostModel = mongoose.model("post",postSchema)

module.exports = PostModel