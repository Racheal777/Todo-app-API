const express = require('express')
const todoController = require('../controllers/todo')
const {saveTodo, getTodos, gettodo, deleteTodo, updateTodo} = todoController

const { authenticate } = require('../middlewares/auth')

const router = express.Router()

//making a post request
router.post('/savetodo', saveTodo)

//making a get request
router.get('/gettodo', getTodos)

router.get('/gettodo/:id', gettodo)

router.delete('/deletetodo/:id', authenticate, deleteTodo)

router.put('/updatetodo/:id', authenticate,  updateTodo)

module.exports = router

