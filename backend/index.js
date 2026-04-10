const express = require('express')
require("dotenv").config()
const app = express()
const connectDB = require("./config/db")

app.use(express.json())

const authRouter = require("./routes/authRoutes")
connectDB()
app.get("/",(req,res) => {
    res.send("Backend server is running now")
})

app.use("/api/auth", authRouter)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})