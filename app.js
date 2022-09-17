require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALTROUNDS);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//calling from .env file
console.log(process.env.API_KEY);

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/logout", (req, res) => {
  res.render("home");
});

// Register Page
app.post("/register", (req, res) => {
  //bcrypt hashing
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    }
  });
});

// Login Page
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          } else {
            res.render("login");
          }
        });
      } else {
        res.render("login");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
