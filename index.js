const express =require("express")
const connection = require("./db")
const userRouter = require("./routes/userRoute")
const postRouter = require("./routes/postRoutes")
const app = express()
const cors = require("cors")
require("dotenv").config()
app.use(express.json())
app.use(cors())
app.use("/users",userRouter)
app.use("/posts",postRouter)


app.get("/",(req,res)=>{
    res.send("Welcome to Home Page")
})


app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port ${process.env.port}`)
})