const express = require('express')
const dotenv = require("dotenv").config()
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use('/',(req,res) => {
    res.status(200).send("The server is running");
})

app.listen(port,()=>{
    console.log(`The server running at port ${port}`)
})