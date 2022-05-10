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
      password : bcrypt.hashSync(password, 10),
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
    if(error.code === 11000){
      res.status(409).json(error)
    }
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

//resetting password
const reset = async (req, res) => {
  try {
    const { email, password, newpassword} = req.body
  
  //check for email
  const user = await User.findOne({ email })

  //if user exist compare old password
  if(user){
    const oldpassword = await bcrypt.compare(password, user.password)
    console.log(oldpassword)

    //if password is the same
    if(oldpassword){
      const id = req.params.id
      
      const data = {
        
        // password: newpassword
        password : bcrypt.hashSync(newpassword, 10),
    
      }
      const updated = await User.updateOne({_id: id}, data)
      const users = await User.findById({_id: id})
      //  const newdata = await User.updateOne({password: newpassword}, updated )

      res.send(updated)
      console.log(data)
      console.log(password)
      console.log(updated)
      console.log(users)
      // console.log("new", newdata)

    }else{
      res.status(401).json('Authentication failed')
    }

    
  }else{
    res.status(401).json('Authentication failed')
  }

  } catch (error) {
    console.log(error)
    
  }
  
}



//exporting modules/functions
module.exports = {
  saveUser,
  Login,
  logout,
  oneUser,
  reset
};
