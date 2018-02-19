const mongoose = require("mongoose");
const { Schema } = mongoose; // == const schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String
});

mongoose.model("user", userSchema);
