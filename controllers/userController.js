const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const Token = require("../model/token");
const crypto = require("crypto");

const { generateToken } = require("../helpers/userHelper");

//saving the user

const Login = async (req, res) => {
  try {
    const { password, email } = req.body;

    //check to see if email matches with any email in the database
    const user = await User.findOne({ email });
    // console.log(oldUser)

    //compare password if email is found
    if (user) {
      const checkVerified = user.verified;
      if (checkVerified) {
        const comparePassword = await bcrypt.compare(password, user.password);
        console.log(comparePassword);

        //if password matches generate taken and set cookie
        if (comparePassword) {
          //then go ahead and set a cookie

          const token = generateToken(user._id);
          res.cookie("jwt", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });

          res.status(201).json(user);
          console.log(user);
        } else {
          res.status(401).json({ errors: "Authentication failed" });
        }
      } else if (!user.verified) {
        return res
          .status(400)
          .send({
            msg: "Your Email has not been verified. Please click on resend",
          });
      }
    } else {
      res.status(401).json({ errors: "Authentication failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: -1,
    });
    res.status(200).json("successfully");
    console.log("working");
    // console.log(token)
  } catch (error) {
    console.log(error);
  }
};

//fetching one user with his todos
const oneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("todos");
    res.json({ user });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

//resetting password
const reset = async (req, res) => {
  try {
    const { email, password, newpassword } = req.body;

    //check for email
    const user = await User.findOne({ email });

    //if user exist compare old password
    if (user) {
      const oldpassword = await bcrypt.compare(password, user.password);
      console.log(oldpassword);

      //if password is the same
      if (oldpassword) {
        const id = req.params.id;

        const data = {
          password: await bcrypt.hash(newpassword, 10),
        };

        const newPassword = await bcrypt.compare(newpassword, user.password);
        console.log(newPassword);

        if (newPassword) {
          res.status(401).send("Cant replace new password with old");
        }

        const updated = await User.updateOne({ _id: id }, data);
        if (updated) {
          // logout(req,res)
          res.cookie("jwt", "", {
            maxAge: -1,
          });
          return res.status(200).send({ successfully: updated });
        }
        const users = await User.findById({ _id: id });
        //  const newdata = await User.updateOne({password: newpassword}, updated )

        console.log(data);
        console.log(password);
        console.log(updated);
        // console.log(users)
        // console.log("new", newdata)
      } else {
        res.status(401).json("Authentication failed");
      }
    } else {
      res.status(401).json("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    //grabbing the email and passing it as a params
    const { email } = req.params;
    const id = req.params.id;
    //setting the reset Token in the model to the string generated by uuid
    const resetToken = uuidv4();
    //  console.log(resetToken)

    //updating at the same time checking if email exist
    const userUpdated = await User.findOneAndUpdate(
      { email },
      { resetToken },
      { new: true }
    );
    console.log(userUpdated);
    res.send(userUpdated);

    if (userUpdated) {
      //send mail
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "kuranchieracheal@gmail.com",
          pass: process.env.password,
        },
      });

      //send mail body
      //to reset user password with the url from the frontend
      //that points to the reset password form
      let sending = {
        from: "kuranchieracheal@gmail.com",
        to: `${email}`,
        subject: "Password Reset",
        text: `To reset your password, Click this link :
        http://localhost:3000/reset-password/${resetToken}`,
      };

      //checking if mail is gone
      transporter.sendMail(sending, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);

          return res.status(200).send("Check your email for a mail");
        }
      });
    } else {
      return res.sen("Email doesnt exist");
    }
  } catch (error) {
    console.log(error);
  }
};

//password reset from email
const resetForgotenPassword = async (req, res) => {
  try {
    //checking for token sent to the mail
    const { resetToken } = req.params;
    const { newpassword } = req.body;

    const harshed = await bcrypt.hash(newpassword, 10);

    const userUpdated = await User.findOneAndUpdate(
      { resetToken },
      { password: harshed },
      { new: true }
    );
    console.log(userUpdated);
    res.status(200).send(userUpdated);
  } catch (error) {
    console.log(error);
  }
};

const signup = async (req, res) => {
  try {
    //destructuring
    const { username, password, email } = req.body;
    const id = req.params.id;

    const addUser = await new User({
      username,
      password: bcrypt.hashSync(password, 10),
      email,
    });

    const user = await addUser.save();

    //generate a token for the user if all details are correct
    if (user) {
      let verifyToken = await new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });

      const tokenVerify = await verifyToken.save();
      console.log("verify token", tokenVerify);

      if (tokenVerify) {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "kuranchieracheal@gmail.com",
            pass: process.env.password,
          },
        });

        let sending = {
          from: "no-reply@example.com",
          to: `${email}`,
          subject: "Account Verification Link",
          text: `Hello ${username}, Please verify your email by
          clicking this link :
          http://localhost:3000/verify-email/${user._id}/${verifyToken.token}`,
        };

        //checking if mail is gone
        transporter.sendMail(sending, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);

            return res.status(200).send("Check your email for a mail");
          }
        });
      } else {
        return res.sen("Email doesnt exist");
      }
    }
    //if user details is correct and saves to the database

    res.status(201).json({ user });
    console.log(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json(error);
    }
    console.log(error);
  }
};

//veryfying the token
const verifyEmail = async (req, res) => {
  try {
    //finding the token which comes with the registeration of user wh
    //which is attached to the email sent
    const token = req.params.token;

    const oneToken = await Token.findOne({ token: token });

    // console.log(oneToken);
    //if token doesnt exist it means it has expired
    if (!oneToken) {
      return res
        .status(400)
        .send({
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });
      //if token exist find user with the token
    } else {
      const oneUser = await User.findOne({ _id: req.params.id });

      if (!oneUser) {
        return res
          .status(401)
          .send({
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });

        //else if user is already verified, tell the user to login
      } else if (oneUser.verified) {
        return res
          .status(200)
          .send("User has been already verified. Please Login");

        //else change the verified to true
      } else {
        const updated = await User.updateOne({
          _id: oneUser._id,
          verified: true,
        });
        console.log(updated);
        // console.log(data)

        if (!updated) {
          return res.status(500).send({ msg: err.message });
          //if user is verified and saved
        } else {
          console.log("oneUser", oneUser);
          return res
            .status(200)
            .send("Your account has been successfully verified");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//resending verification to email
const resendLink = async (req, res) => {
  try {
   
    const { email } = req.body;
  //first find the email
  const user = await User.findOne( email );
  //if email is not found, tell the person to signup
  if (!user) {
    return res.status(400).send({ msg: "email not found, type correct email" });

    //ese check if email is already verified
  } else if (user.verified) {
    return res.status(200).send("This account is already verified, Login");

    //if all this are not achieved, go ahead and send another link to the email
  } else {
    
    let verifyToken = await new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    let tokensent = await verifyToken.save();

    //if token is saved, send an email to the user to verify email
    if (tokensent) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "kuranchieracheal@gmail.com",
          pass: process.env.password,
        },
      });

      let sending = {
        from: "no-reply@example.com",
        to: `${user.email}`,
        subject: "Account Verification Link",
        text: `Hello ${user.username}, Please verify your email by
        clicking this link :
        http://localhost:3000/verify-email/${user._id}/${verifyToken.token}`,
      };

      //checking if mail is gone
      transporter.sendMail(sending, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          return res
            .status(200)
            .send(
              "A verification email has been sent to " +
                user.email +
                ". It will be expire after one day. If you not get verification Email click on resend token."
            );
        }
      });
    } else {
      return res.sen("Email doesnt exist");
    }
  }
  
  } catch (error) {
    console.log(error)
    
  }
  
};

//exporting modules/functions
module.exports = {
  signup,
  Login,
  logout,
  oneUser,
  reset,
  forgotPassword,
  resetForgotenPassword,
  verifyEmail,
  resendLink
};
