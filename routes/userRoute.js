const express = require('express')
const userController = require('../controllers/userController')
const {saveUser, Login, logout} = userController

const router = express.Router()

//saving user request
router.post('/save', saveUser)

//login
router.post('/login', Login)

//logout
router.get('/loggingout', logout)



module.exports = router

