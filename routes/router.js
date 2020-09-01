const router = require("express").Router();
const { connectDB } = require("../dbConnection/db");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");

router.get("/", (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwtDecode(token);
  const user = decodedToken;
  res.render("home", { user });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
