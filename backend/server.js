const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const challengesRoutes = require("./routes/challengesRoutes")
const contestRoutes = require("./routes/contestRoutes")


dotenv.config()

PORT = process.env.PORT || 5000;
connectDB();

const app = express()

app.use(express.json())
app.use(cors());


app.get("/", (req,res) => {
    res.send("hello")
})


  
app.use("/", userRoutes)
app.use("/c", challengesRoutes)
app.use("/t", contestRoutes)

app.listen(PORT, (req,res)=> {
    console.log("server running at Port 5000");
})
