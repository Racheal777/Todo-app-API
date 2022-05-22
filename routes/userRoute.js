const express = require('express')
const userController = require('../controllers/userController')
const { Login, logout,
     oneUser, reset, forgotPassword, 
     signup, resetForgotenPassword,
    verifyEmail, resendLink } = userController

const emailing = require('../email/sendmail')
const { sendMail } = emailing

const router = express.Router()

//saving user request


router.post('/signup', signup)

//verrifying email route
router.get('/verify-email/:id/:token', verifyEmail)

//resend link verrifying email route
// router.get('/verify-email/:id/:token', resendLink)

router.get('/resend-link', resendLink)

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

//reset forgoten password
router.put('/resetpassword/:resetToken', resetForgotenPassword )

//posting mail
router.post('/mailing', sendMail)


module.exports = router

