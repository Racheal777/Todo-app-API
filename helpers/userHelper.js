const jwt = require('jsonwebtoken')

//generating token with the sign in jwt and a secret key
module.exports.generateToken = (id) => {
    return jwt.sign({id}, process.env.SecretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000
    })
}