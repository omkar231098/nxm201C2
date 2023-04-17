const express = require("express");
const { BlogModel  } = require("../Model/blog.model");
BlogRouter = express.Router();
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticator");
const { authrolechecker} = require("../middlewares/auth-role-checker");
require("dotenv").config()



// this will add blogs 
BlogRouter.post("/add", authenticate,authrolechecker(["User"]), async (req, res) => {
  const payload = req.body;

  try {
    const product = new  BlogModel(payload);
    await product.save();
    res.status(200).send({ msg: "New Blog has been Added in Database" });
  } catch (err) {
    res.status(404).send({ msg: "Not able to add Blog" });
  }
});

//this will show you blogs

BlogRouter.get("/", authenticate , authrolechecker(["User"]), async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.NormalToken);
  
  try {
    const product = await  BlogModel.find({userID:decoded.userID}); 
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send({ msg: "Not able to read" });
  }
});


// this will update the products
BlogRouter.patch("/update/:userid",authenticate,authrolechecker(["User"]), async (req, res) => {
  const { userid } = req.params;
  const payload = req.body;
  try {
    await  BlogModel.findByIdAndUpdate({ _id: userid }, payload);
    res.status(200).send("Blog has been updated");
  } catch (err) {
    res.status(404).send({ msg: "Not able to update" });
  }
});

// this willl delete the products
BlogRouter.delete("/delete/:userid",authenticate,authrolechecker(["User","Moderator"]) ,async (req, res) => {
  const { userid } = req.params;

  try {
    await  BlogModel.findByIdAndDelete({ _id: userid });
    res.status(200).send("Blog has been deleted");
  } catch (err) {
    res.status(404).send({ msg: "Not able to delete" });
  }
});


// moderater can access all blogs by get method

BlogRouter.get("/mod", authenticate , authrolechecker(["Moderator"]), async (req, res) => {
 
  
  try {
    const product = await  BlogModel.find({}); 
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send({ msg: "Not able to read" });
  }
});





module.exports = { BlogRouter };
