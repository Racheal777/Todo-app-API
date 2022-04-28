const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/userHelper");

//saving the user
const saveUser = async (req, res) => {
  try {
    //destructuring
    const { username, password, email } = req.body;

      const hashed = bcrypt.hashSync(password, 10)
    const addUser = await new User({
      username,
      password : hashed,
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
    console.log(error);
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
        res.status(401).json({ errors: "Authentication failed" });
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
    res.cookie("jwt", '', {
      maxAge: -1,   
    })
  res.status(200).json("successfully")
  console.log('working')
  // console.log(token)
  } catch (error) {
    console.log(error)  
  } 
}


//fetching one user with his todos
const oneUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id).populate('todos')
    res.json({user})

  } catch (error) {
    console.log(error)
  }
  
}





//exporting modules/functions
module.exports = {
  saveUser,
  Login,
  logout,
  oneUser
};
