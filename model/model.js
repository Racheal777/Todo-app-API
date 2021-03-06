const mongoose = require('mongoose')

const { Schema } = mongoose

const TodosSchema = new Schema({
    todo : {
        type: String
    },

    status: {
        type: String,
        default: "pending"
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Todo = mongoose.model("Todo", TodosSchema)

module.exports = Todo