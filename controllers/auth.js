const { connectDB } = require("../dbConnection/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = connectDB();

const register = (req, res) => {
  console.log(req.body);
  const { name, email, password, confirmPassword } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      try {
        if (error) {
          console.log(error);
        } else if (results.length > 0) {
          return res.render("register", {
            message: "That email is already in use",
          });
        } else if (password !== confirmPassword) {
          return res.render("register", {
            message: "Passwords do not match",
          });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users SET ?",
          {
            name: name,
            email: email,
            password: hashedPassword,
          },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(results);
              return res.render("register", { message: "User registered" });
            }
          }
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide an email and password",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);

        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res
            .status(401)
            .render("login", { message: "Email or Password is incorrect" });
        } else {
          const { id, name, email } = results[0];

          const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
            expiresIn: 1000 * 60 * 60,
          });

          console.log(`The token is ${token}`);

          const cookieOptions = {
            expires: new Date(Date.now() + 1000 * 60 * 60),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { register, login };
