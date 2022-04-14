const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/userHelper");

//saving the user
const saveUser = async (req, res) => {
  try {
    //destructuring
    const { username, password, email } = req.body;

    const addUser = await new User({
      username,
      password,
      email,
    });

    const user = await addUser.save();

    //if user details is correct and saves to the database
    //generate token with the id and set cookie with the token
    if (user) {
      //generate token
      const token = generateToken(user._id);
      //use token to set cookie
      res.cookie("jwt", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      console.log(token);
      console.log("user created");
    }
    res.status(201).json({ user });
    console.log(user);
    
  } catch (error) {
    console.log(error.message);
  }
};

const Login = async (req, res) => {
  try {
    const { password, email } = req.body;

    //check to see if email matches with any email in the database
    const user = await User.findOne({ email });
    // console.log(oldUser)

    //compare password if email is found
    if (user) {
      const comparePassword = await bcrypt.compare(password, user.password);
      console.log(comparePassword);

      //if password matches generate taken and set cookie
      if (comparePassword) {
        const token = generateToken(user._id);
        res.cookie("jwt", token, {
          maxAge: 2 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.status(201).json(user);
        console.log(user);
      } else {
        res.json({ password: "password incorrect" });
      }
    } else {
      res.json({ email: "email not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  saveUser,
  Login,
};
