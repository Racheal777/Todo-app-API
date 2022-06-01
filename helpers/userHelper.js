const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

//generating token with the sign in jwt and a secret key
module.exports.generateToken = ( id ) => {
    return jwt.sign({ id }, process.env.SecretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000
    })
}

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "kuranchieracheal@gmail.com",
//       pass: process.env.password,
//     },
//   });

//   let sending = {
//     from: "no-reply@example.com",
//     to: `${email}`,
//     subject: "Account Verification Link",
//     text: `Hello ${username}, Please verify your email by
//     clicking this link :
//     http://localhost:3000/verify-email/${user._id}/${verifyToken.token}`,
//   };

//   //checking if mail is gone
//   transporter.sendMail(sending, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);

//       return res.status(200).send("Check your email for a mail");
//     }
//   });

module.exports.mailing = async ({from, to, subject, text,}) => {
    const mailOptions = {
        from, to, subject, text
    }

    let transporter = nodemailer.createTransport({
            service: process.env.emailService,
            auth: {
              user: process.env.email,
              pass: process.env.password,
            },
          });

          return await transporter.sendMail(mailOptions)

} 