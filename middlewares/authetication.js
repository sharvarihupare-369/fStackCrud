const jwt = require("jsonwebtoken");
const BlackListModel = require("../models/blackListModel");

const authentication = async(req,res,next) => {
    const {email,password}  = req.body
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).send({ message: 'Access token not found' });
    }

    const blackListToken = await BlackListModel.findOne({token})
    if(blackListToken){
        return res.status(400).send({ message: 'Token revoked' });
    }

    jwt.verify(token,process.env.jwt_secretkey,async(err,decoded)=>{
        if(decoded){
            req.userId = decoded.userId
            req.name = decoded.name
            next()
        }else{
           return  res.status(400).send({ message: 'Invalid token' });
        }
    })

}

module.exports = authentication