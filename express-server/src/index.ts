import express,{Request,Response} from 'express'
import cors from 'cors'
import { createClient } from 'redis';

const app = express();

app.use(express.json())
app.use(cors({
    origin : "*"
}))

const client = createClient();
client.connect();

app.post("/submit", async (req : Request, res: Response) => {
    try {
        const {problemId, userId, code, language} = req.body

        await client.lPush("submissions", JSON.stringify({problemId, userId, code, language}))
        res.json({
            message : "Submission received"
        })   
    } catch (error) {
        res.json({
            message : "Submission failed"
        }) 
    }
})

app.listen(8000,() => {
    console.log("App is running");
})
