const express = require('express')
const mongoose = require('mongoose')


const todoController = require('../controllers/todo')

const router = express.Router()

//making a post request
router.post('/savetodo', todoController.saveTodo)

//making a get request
router.get('/gettodo', todoController.getTodos)

router.get('/gettodo/:id', todoController.gettodo)

router.delete('/deletetodo/:id', todoController.deleteTodo)

router.put('/updatetodo/:id', todoController.updateTodo)

module.exports = router

