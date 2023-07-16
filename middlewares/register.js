const UserModel = require("../models/userModel");

const register = async(req,res,next) => {

    const {email,password} = req.body;

    if(password.length < 8){
        return res.status(400).send({"msg":"Password must contains at least 8 characters"})
    }

    if(!/\d/.test(password)){
        return res.status(400).send({"msg":"Password must contains at least one number"})
    }

    if(!/[!@#$%^&*]/.test(password)){
        return res.status(400).send({"msg":"Password must contains at least one special character"})
    }

    if(!/[A-Z]/.test(password)){
        return res.status(400).send({"msg":"Password must contains at least one uppercase character"})
    }

    const existUser = await UserModel.findOne({email})
    if(existUser){
        return res.status(400).send({"msg":"User Already Exists"})
    }

    next()

}

module.exports = register