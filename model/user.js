//requiring modules
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

//user schema
const userSchema = new Schema({
    username : {
        type: String
    },

    email: {
        type: String,
        trim: true,
        required: [true, "Please enter your email"],
        unique: true
    },

    password : {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Please password length should be at least 8"]
    },
    todos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Todo"
        }
    ]

    
}, {timestamps: true}, )

// //before saving user, hash password 
// userSchema.pre('save', async function(next) {
//     //generating the salt
//     const salt = await bcrypt.genSalt()

//     //adding the salt to the password
//     this.password = await bcrypt.hash(this.password, salt)
    
//     //running the code after hashing password
//     next()
// })

//setting the user model
const User = mongoose.model("User", userSchema)


//exporting the user
module.exports = User

