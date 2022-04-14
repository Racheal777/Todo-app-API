//requiring modules
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../model/model");

//saving a todo in the database
const saveTodo = async (req, res) => {
  const { todo } = req.body;
  const data = {
    todo,
  };

  const todos = await new Todo(data);
  todos
    .save()
    .then((result) => {
      if (result) {
        res.send(todos);
        console.log(todos);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//fetching your todo with the find method in mongoose
const getTodos = (req, res) => {
  Todo.find()
    .then((result) => {
      if (result) {
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const gettodo = async (req, res) => {
    try {
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
