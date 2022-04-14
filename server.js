//requiring modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const todoRoute = require('./routes/todoR')
const PORT = process.env.PORT || 7000

const app = express()




//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//cross origin request 
//Accessing the frontend with its ports number
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['*']
}))

//database connection
const mongoUri = "mongodb://127.0.0.1:27017/todo-app"
mongoose.connect(mongoUri, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(result => {
    console.log("Database connected")
}).catch(err => {
    console.log(err)
})


app.use(todoRoute)


app.listen(PORT, () => console.log(`Server is running at ${PORT}`))