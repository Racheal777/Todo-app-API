const express = require('express')
const mongoose = require('mongoose')


const todoController = require('../controllers/todo')

const {saveTodo, getTodos, gettodo, deleteTodo, updateTodo} = todoController

const router = express.Router()

//making a post request
router.post('/savetodo', saveTodo)

//making a get request
router.get('/gettodo', getTodos)

router.get('/gettodo/:id', gettodo)

router.delete('/deletetodo/:id', deleteTodo)

router.put('/updatetodo/:id', updateTodo)

module.exports = router

