const express =require("express")
const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")
require("dotenv").config()
const UserModel = require("../models/userModel")
const register = require("../middlewares/register")
const BlackListModel = require("../models/blackListModel")
const userRouter = express.Router()


userRouter.get("/",(req,res)=>{
    res.send("Hello Users")
})

userRouter.post("/register",register,async(req,res)=>{
    try {

        const {email,password} = req.body
        const newpassword = await bcrypt.hash(password,10)
        const user = await UserModel.create({...req.body,password:newpassword})
        res.status(200).send({"msg":"User Registered Successfully",user})
       
        return
    } catch (error) {
        res.status(400).send({"errormsg":error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).send({"msg":"Invalid Credentials"})
        }

        const comparepassword = await bcrypt.compare(password,user.password)
        if(!comparepassword){
            return res.status(400).send({"msg":"Invalid Credentials"})
        }else{
            const token =  jwt.sign({userId:user._id,name:user.name}, process.env.jwt_secretkey ,{expiresIn:"7hr"})
            const refreshToken = jwt.sign({email},process.env.refresh_key,{expiresIn:"2d"})
            return res.send({msg:"User logged in successfully",token,refreshToken})
        }

    } catch (error) {
        res.status(400).send({"errormsg":error.message}) 
    }
})

userRouter.get("/logout",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        res.status(400).send({"msg":"Please Login First"})
    }
    try {
       const blacklist = await BlackListModel.create({token})
       res.status(200).send("User Logged out")
       return
    } catch (error) {
        res.status(400).send({"errormsg":error.message}) 
    }
})


module.exports = userRouter;