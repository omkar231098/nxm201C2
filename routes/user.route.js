const express = require("express");
const { UserModel } = require("../Model/user.model");
const bycrypt = require("bcrypt");
userRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const { authenticate } = require("../middlewares/authenticator");


// post route to register the user

userRouter.post("/register", async (req, res) => {
    const { email, password ,role} = req.body;
  
    try {
      const UserPresent = await UserModel.findOne({ email });
  
      if (UserPresent) {
        res.status(200).send({ Message: "User already exist, please login" });
      }
      const HashPassword = await bycrypt.hash(password, 12);
      const NewUser = new UserModel({
        email,
        password: HashPassword,
        role
      });
  
      await NewUser.save();
  
      res.status(200).send({ Message: "Save Successfully" });
    } catch (err) {
      res.status(404).send(err);
    }
  });




  userRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserPresent = await UserModel.findOne({ email });
      if (!isUserPresent) {
        // user not present
        return res.status(400).send({ msg: "Not a user, please signup" });
      }
  
      const isPasswordCorrect =bycrypt.compareSync(
        password,
        isUserPresent.password
      );
      if (!isPasswordCorrect)
        return res.status(400).send({ msg: "Wrong credentials" });
      // generate tokens
  
      // accessTOken and refreshTOken
      const accessToken = jwt.sign(
        { "userID":isUserPresent._id},
        process.env.NormalToken,
        { expiresIn: "1m" }
      );
      const refreshToken = jwt.sign(
        { "userID":isUserPresent._id},
        process.env.RefreshToken,
        { expiresIn: "3m" }
      );
      // store these tokens
      // cookies set a cookie
      res.send({"accessToken":accessToken,"refreshToken":refreshToken})
    //   res.cookie("pscAccessToken", accessToken, { maxAge: 2000 * 60 });
    //   res.cookie("pscRefreshToken", refreshToken, { maxAge: 1000 * 60 * 3 });
      res.send({ msg: "Login success" });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  });




















  
// post route to login the user

// userRouter.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const UserPresent = await UserModel.findOne({ email });
//       if (!UserPresent) {
//         res.status(200).send({ msg: "User is not register yet!!" });
//       }
  
//       const validpassword = await bycrypt.compare(password, UserPresent.password);
  
//       if (!validpassword) {
//         res.send("Password is invalid");
//       }
//   // generate the token
//       const token = jwt.sign({ "userID":UserPresent._id}, "masai",{ expiresIn: '3h' });
  
//       res.status(200).send({ msg: "Login Successful", token: token });
//     } catch (err) {
//       res.status(404).send(err);
//     }
//   });
  


module.exports={userRouter}