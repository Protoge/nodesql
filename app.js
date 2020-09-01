const express = require("express");
const { connectDB } = require("./dbConnection/db");
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

require("dotenv").config();

const db = connectDB();

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL connected");
  }
});

hbs.registerPartials(path.join(__dirname, "./views/partials"));

app.use(express.static("public"));

app.set("view engine", "hbs");

app.use("/", require("./routes/router"));

app.use("/auth", require("./routes/auth"));

app.listen(3001, () => console.log("server running"));
