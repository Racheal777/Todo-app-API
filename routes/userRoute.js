const express = require('express')
const userController = require('../controllers/userController')
const { saveUser, Login, logout, oneUser, reset, forgotPassword } = userController
const emailing = require('../email/sendmail')
const { sendMail } = emailing

const router = express.Router()

//saving user request
router.post('/save', saveUser)

//login
router.post('/login', Login)

//get user
router.get('/oneuser/:id', oneUser)

//logout
router.get('/loggingout', logout)

//reseting password
router.put('/reset/:id',reset )

//forgoten password
router.put('/forgotpassword/:email', forgotPassword)

//posting mail
router.post('/mailing', sendMail)


module.exports = router

