//requiring modules
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../model/model");
const User = require('../model/user')

//saving a todo in the database
const saveTodo = async (req, res) => {
  try {
    const { todo } = req.body;
    const { id } = req.params
    const data = {
      todo,
      user: id
    };
  
    //destructuring the id so we dont type it
    const newData = {...data, user:id}

    const newtodo = await new Todo(newData)

    // console.log(data)
    // console.log("new", newtodo)
  
    const oneTodo = await newtodo.save()
    // console.log("onetodo", oneTodo)
  
    //fetching the user
    const fetchUser = await User.findById(id)
    // console.log("fetch", fetchUser);
  
    //pushing the todos to the user
    fetchUser.todos.push(oneTodo)

  //saving the fetch user
    await fetchUser.save()

    res.json({user: fetchUser}) 
  } catch (error) {
    console.log(error)
  }
  

};

//fetching your todo with the find method in mongoose
// const getTodos = (req, res) => {
//   Todo.find()
//     .then((result) => {
//       if (result) {
//         res.send(result);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

//geting one todo 
const gettodo = async (req, res) => {
    try {
      // console.log(req)
        const { id } = req.params
        const todo = await Todo.findById(id)
        res.send(todo)
    } catch (error) {
        console.log(error)
        
    }

}

//deleting

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params
        const deletedtodo = await Todo.findByIdAndDelete(id)

        res.status(200).json({msg: "Deleted successfully"})

    } catch (error) {
        console.log(error)
        
    }
}


const updateTodo = async(req,res) => {
    const { status } = req.body;
  const data = {
    status,
  };
    const { id } = req.params
    Todo.updateOne({ _id: id}, data).then(result => {
        if(result){
            res.status(200).json({ updated: "Status changed", result})

            console.log(data)
        }
    }).catch(err => {
      res.status(404).json({err: err.message})
        console.log(err)
    })
}


const updatedTodo = async(req,res) => {
    const { status } = req.body;
  const data = {
    status,
  };
    const { id } = req.params
    Todo.findByIdAndUpdate({ _id: id}, data).then(result => {
        if(result){
            res.send(result)
        }
    }).catch(err => {
        console.log(err)
    })
}

//exporting the modules
module.exports = {
  saveTodo,
  getTodos,
  gettodo,
  deleteTodo,
  updateTodo,
  updatedTodo
};
