const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://omerabubakar234_db_user:Omer12345@cluster0.imsvtb7.mongodb.net/internshipDB?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  technology: String,
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        technology: req.body.technology,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User Deleted",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json(error);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});