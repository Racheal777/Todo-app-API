const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

//saving user request
router.post('/save', userController.saveUser)

//login
router.post('/login', userController.Login)



module.exports = router

