const User = require("../models/user");
const jwt = require("jsonwebtoken");
const handleError = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };
  if (err.message === "incorrect Email") {
    error.email = "Unrigesterd Email";
  }
  if (err.message === "incorrect password") {
    error.password = "password incorrect";
  }
  if (err.code === 11000) {
    error.email = "that email already exist";
    return error;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "sirlight", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("../views/partials/signup.ejs");
};
module.exports.login_get = (req, res) => {
  res.render("../views/partials/login.ejs");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
