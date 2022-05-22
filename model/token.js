
//requiring modules
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose

//user schema
const tokenSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    token: {
        type: String,
        required: true,
        
    },

    expiredAt : {
        type: Date,
        default: Date.now,
        index: {expires: '1d' }
        
        
    },
    
    
}, {timestamps: true}, )


//setting the user model
const Token = mongoose.model("Token", tokenSchema)


//exporting the user
module.exports = Token

