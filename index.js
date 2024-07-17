const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use('/',(req,res) => {
    res.send("Hello");
})

app.listen(8000,()=>{
    console.log(`The server running at port ${8000}`)
})