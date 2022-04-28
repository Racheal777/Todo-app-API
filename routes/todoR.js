const express = require('express')
const todoController = require('../controllers/todo')
const {saveTodo, getTodos, gettodo, deleteTodo, updateTodo} = todoController

const { authenticate } = require('../middlewares/auth')

const router = express.Router()

//making a post request
router.post('/savetodo/:id', saveTodo)

//making a get request
router.get('/gettodos', getTodos)

//fetching one todo
router.get('/gettodo/:id', gettodo)

//deleting a todo
router.delete('/deletetodo/:id', authenticate, deleteTodo)

//updating a todo
router.put('/updatetodo/:id', authenticate,  updateTodo)

module.exports = router

