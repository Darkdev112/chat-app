const dotenv = require("dotenv").config()
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

// const app = express()
const server = http.createServer()
const io = socketio(server,{
    cors : {
        origin : "http://localhost:5173"
    }
})
const port = process.env.PORT

// app.use(cors())
// app.use('/',(req,res) => {
//     res.status(200).send("The server is running");
// })

let dashboard = [];

io.on("connection",(socket) => {
    socket.on('scores',(data)  => {
        dashboard.push({...data, id: socket.id});
        socket.emit('dashboard', dashboard);
        setInterval(() => {
            socket.emit('dashboard', dashboard);
        },5000)
    })
    socket.on('del-scores',(data)  => {
        dashboard = dashboard.filter((score) => {
            return score.user!= data.user 
        })
        socket.emit('dashboard', dashboard);
        setInterval(() => {
            socket.emit('dashboard', dashboard);
        },5000)
    })
    socket.on('put-scores',(data)  => {
        dashboard.forEach((score) => {
            if(score.user==data.user){
                score.score=data.score;
            }
        })
        socket.emit('dashboard', dashboard);
        setInterval(() => {
            socket.emit('dashboard', dashboard);
        },5000)
    })
})

server.listen(port,()=>{
    console.log(`The server running at port ${port}`)
})