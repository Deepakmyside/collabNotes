const express = require('express')
require("dotenv").config()
const app = express()
const connectDB = require("./config/db")

app.use(express.json())

const authRouter = require("./routes/authRoutes")
const noteRouter = require("./routes/noteRoutes")

app.use("/api/auth", authRouter)
app.use("/api/notes", noteRouter)

connectDB()
app.get("/",(req,res) => {
    res.send("Backend server is running now")
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})