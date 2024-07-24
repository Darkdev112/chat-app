const socket = io("http://localhost:8000");

const msgs = document.getElementById('msgs')
const msgc = document.getElementById('msgc')

socket.on("connect",(response) => {
    console.log(response);
})

socket.on("message",(data) => {
    msgc.innerText = data
    data = data.toUpperCase()
    socket.emit("message",data)
})