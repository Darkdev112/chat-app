const dotenv = require("dotenv").config()
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

// const app = express()
const server = http.createServer()
const socket = socketio(server,{
    cors : {
        origin : "http://localhost:3000"
    }
})
const port = process.env.PORT

// app.use(cors())
// app.use('/',(req,res) => {
//     res.status(200).send("The server is running");
// })

socket.on("connection",(soc) => {
    soc.on("message",(data)  => {
        console.log(data);
    })
    soc.emit("message","Hi, I am Dev!");
})

server.listen(port,()=>{
    console.log(`The server running at port ${port}`)
})