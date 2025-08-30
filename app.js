const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");
// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get("*", checkUser);
// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "  mongodb+srv://ibrahimsaad134:Vp38PWQ6ggMSdAT0@cluster0.g1lv0iy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(3000, () => console.log("Server running on port 3000"))
  )
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
app.get("/set-cookies", (req, res) => {
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send("You Got The Cockie");
});

app.get("/get-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
});
