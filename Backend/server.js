const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://omerabubakar234_db_user:Omer12345@cluster0.imsvtb7.mongodb.net/internshipDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));
``


// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  technology: String,
});

const User = mongoose.model("User", userSchema);

// Save Data
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Saved");
  } catch (err) {
    res.send("Error");
  }
});
``

// Get Data
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Server run
app.listen(5000, () => {
  console.log("Server running on port 5000");
});