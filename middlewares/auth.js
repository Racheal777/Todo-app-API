const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


module.exports.authenticate = (req, res, next) =>{
    //accessing the cookie
    const token = req.cookies.jwt
    console.log(token)

    //check if the token matches with the one generated by the private key
    if(token){
        jwt.verify(token, process.env.SecretKey, (err, decoded) => {
            if(err){
                console.log(err)
            }else{
                //res.json(decoded)
                console.log(decoded)
                next()
            }
        })
    }else{
        res.json("token not existing")
    }
}