const express = require("express")
const authentication = require("../middlewares/authetication")
const PostModel = require("../models/postModel")
const postRouter = express.Router()

postRouter.post("/add",authentication,async(req,res)=>{
    const {title,body,device,no_of_comments} = req.body
    try {
        const post = await PostModel.create({title,body,device,no_of_comments,creator:req.userId,name:req.name})
        return res.status(200).send({"msg":"Post added",post})
    } catch (error) {
        res.status(400).send({"errmsg":error.message})
    }
})


postRouter.get("/",authentication,async(req,res)=>{
   
    try {
        const post = await PostModel.find({creator:req.userId})
        return res.status(200).send(post)
    } catch (error) {
        res.status(400).send({"errmsg":error.message})
    }
})

postRouter.get("/search",async(req,res)=>{
    const { q } = req.query;
    try {
        // const device = new RegExp(searchQuery,"i")
        // const post = await PostModel.find({device})
        //  res.status(200).json(post)
        if(!q){
            const post = await PostModel.find(req.query)
            res.status(200).send(post)
        }else{
            const post = await PostModel.find({ device: { $regex: q, $options: "i" } });
            res.status(200).send(post);
        }
    } catch (error) {
         res.status(400).send({'msg' : error.message})
    }
})



postRouter.patch("/update/:id",authentication,async(req,res)=>{
     try {
        const post = await PostModel.findById(req.params.id)
        if(post.creator.toString() != req.userId){
            res.send("Yor are not allowed to update the post")
        }
        const updatedPost = await PostModel.findByIdAndUpdate(req.params.id,req.body,{new : true})
        res.status(200).send(updatedPost)
     } catch (error) {
        res.status(400).send({"errmsg":error.message})
     }
})

postRouter.get("/filter",async(req,res)=>{
    const {no_of_comments} = req.query
    try {
        const post = await PostModel.find({no_of_comments})
        res.status(200).send(post)
    } catch (error) {
        res.status(500).send({ "error": error.message  });
    }
  })


postRouter.get("/pagination",async(req,res)=>{
    const {page,limit} = req.query
    try {
        const pageNum = +page || 1
        const limits  = +limit || 10
        const skip = (pageNum - 1 )*limits
        const findPost = await PostModel.find().skip(skip).limit(limit)
        res.status(200).send(findPost)
      
    } catch (error) {
        res.status(500).send({ "error": error.message  });
    }
})

postRouter.delete("/delete/:id",authentication,async(req,res)=>{
    try {
       const post = await PostModel.findByIdAndDelete(req.params.id)
    //    if(post.creator.toString() != req.userId){
    //        res.send("Yor are not allowed to delete the post")
    //    }
       const deletedPost = await PostModel.findByIdAndDelete({_id:req.params.id})
       res.status(200).send("Post deleted from DB")
       return
    } catch (error) {
       res.status(400).send({"errmsg":error.message})
       return
    }
})



module.exports = postRouter