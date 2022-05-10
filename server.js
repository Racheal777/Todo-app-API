//requiring modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const todoRoute = require('./routes/todoR')
const userRoute = require('./routes/userRoute')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 7070

const app = express()


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//cross origin request 
//Accessing the frontend with its ports number
app.use(cors({
    credentials: true,
    // origin: "https://todo-8ocs6olvs-racheal777.vercel.app",
    origin: "http://localhost:3000",
     methods: "GET, POST, OPTIONS, PUT, DELETE",
    // headers : ("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"),
}))

//database connection
// const mongoUri = "mongodb://127.0.0.1:27017/todo-app"

const mongo = process.env.mongouri
mongoose.connect(mongo, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(result => {
    console.log("Database connected")
}).catch(err => {
    console.log(err)
})

//middleware for routers
app.use('/api/users',userRoute)
app.use(todoRoute)



app.listen(PORT, () => console.log(`Server is running at ${PORT}`))