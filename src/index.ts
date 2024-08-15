import express,{Request, Response} from "express"
import WebSocket,{WebSocketServer} from "ws";

const app = express()
app.get('/',(req : Request,res : Response) => {
    res.status(200).send("Welcome to your server...")
})
const server = app.listen(8000,() => {
    console.log("Server is running");
})

const wss = new WebSocketServer({server})
let userConnected = 0;

wss.on("connection",(socket) => {
    socket.on('error', (error) => {
        console.log(error);
    })

    socket.on("message",(data, isBinary) => {
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(data, {binary : isBinary})
            }
        })
    })

    console.log("Users : ", ++userConnected);
    socket.send(`Hello from server to user ${userConnected}`)
})