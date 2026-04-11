const express = require('express')
require("dotenv").config()
const cors = require('cors')
const app = express()
const http = require('http')
const { Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

const connectDB = require("./config/db")
const socketHandler = require('./socket/socketHandler')


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


const authRouter = require("./routes/authRoutes")
const noteRouter = require("./routes/noteRoutes")

app.use("/api/auth", authRouter)
app.use("/api/notes", noteRouter)

socketHandler(io)
connectDB()
app.get("/",(req,res) => {
    res.send("Backend server is running now")
})

server.listen(3000, () => {
    console.log('Server running on port 3000')
})