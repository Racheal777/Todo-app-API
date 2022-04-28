const express = require('express')
const userController = require('../controllers/userController')
const { saveUser, Login, logout, oneUser } = userController

const router = express.Router()

//saving user request
router.post('/save', saveUser)

//login
router.post('/login', Login)

//get user
router.get('/oneuser/:id', oneUser)

//logout
router.get('/loggingout', logout)



module.exports = router

