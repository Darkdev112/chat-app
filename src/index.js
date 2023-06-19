const express = require('express')
const http = require('http')
const path =  require('path')
const dotenv = require('dotenv').config({path : path.join(__dirname, '../config/dev.env')})
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./users')


const app = express()
const server = http.createServer(app)
const port = process.env.PORT
const  io = socketio(server)


const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New Websocket connection');

    socket.on('join', (options, callback) => {

        const {error, user} = addUser({ id : socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const currentUser = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        io.to(currentUser.room).emit('message', generateMessage(msg,currentUser.username))
        callback('Delivered!')
        
    })

    socket.on('sendLocation', (pos, callback) => {
        const currentUser = getUser(socket.id)
        io.to(currentUser.room).emit('location-message', generateLocationMessage(`https://google.com/maps?q=${pos.lat},${pos.long}`, currentUser.username))
        callback('location shared')
    })

    socket.on('disconnect', () => {
        const removedUser = removeUser(socket.id)
        console.log(removedUser);
        if(removedUser){
            io.to(removedUser.room).emit('message', generateMessage(`${removedUser.username} has left`))
            io.to(removedUser.room).emit('roomData',{
                room : removedUser.room,
                users : getUsersInRoom(removedUser.room)
            })
        }

    })
})


server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})