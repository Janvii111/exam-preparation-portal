const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


// ================= DATABASE =================
mongoose.connect("mongodb+srv://examadmin:Jagruti111@cluster0.rr2emuo.mongodb.net/examDB?retryWrites=true&w=majority",
)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));


// ================= MODELS =================

// Paper Model
const Paper = mongoose.model("Paper", {
  subject: String,
  year: String,
  academicYear: String,
  semester: String,
  examType: String,
  file: String
}, "papers");   // 👈 FORCE collection name

// User Model
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});


// ================= AUTH APIs =================

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    // create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.send({ success: true, message: "Signup successful" });

  } catch (err) {
    res.send({ success: false, message: "Error in signup" });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }

  } catch (err) {
    res.send({ success: false });
  }
});


// ================= PAPER API =================

// Get all papers
app.get("/papers", async (req, res) => {
  const papers = await Paper.find();
  res.send(papers);
});


// ================= STATIC FILES =================
app.use("/papers", express.static("papers"));


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});