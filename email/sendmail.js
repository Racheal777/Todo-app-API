//importing modules

const nodemailer = require('nodemailer')

//sending mail
const sendMail = (req, res) => {
    const { email, message , subject} = req.body

    //email auth
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "kuranchieracheal@gmail.com",
            pass: process.env.password
        }
    })

    //send mail body
    let sending = {
        from: "kuranchieracheal@gmail.com",
        to: `${email}`,
        subject: `${subject}`,
        text: `${message}`

    }

    //checking if mail is gone
    transporter.sendMail(sending, function(error, info){
        if(error) {
            console.log(error)
        }else{
            console.log('Email sent: ' + info.response)
        }

        res.send(info)
    })

}


module.exports = {
    sendMail
}