const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: String,
  description:String,
  userID:String
});

const BlogModel = mongoose.model("Blog", BlogSchema);
module.exports = { BlogModel };
