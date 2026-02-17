const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = process.env.APP_PORT | 3000


//milldware
app.use(cors())
app.use(express.json())



//listen
app.listen(port, 
    ()=> console.log (`http//localhost:${port}`)
)