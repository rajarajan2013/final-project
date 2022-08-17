const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/User");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !password)
      throw new Error("Missing information");

    let user = await User.findOne({ email });
    if (user) throw new Error("Account already exists!");

    const SALT = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, SALT);
    user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    user = user.toObject();
    delete user.password;

    user.token = jwt.sign(user, "mysecret123", { expiresIn: "30d" });

    return res.status(201).json({
      message: "Account created successfully!",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Error("Missing information");

    let user = await User.findOne({ email });
    if (!user) throw new Error("Account does not exist!");

    // password - abc123
    // user.password - $2k.sdf9qjfiqdioqdjfasdfdsfoj
    const passswordMatches = await bcrypt.compare(password, user.password);
    if (!passswordMatches) throw new Error("Invalid Credentials!");

    user = user.toObject();
    delete user.password;

    user.token = jwt.sign(user, "mysecret123", { expiresIn: "30d" });

    return res.status(200).json({
      message: "Login successfully!",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
});

mongoose
  .connect(DB_URL)
  .then((_) => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Unable to connect to MongoDB: ${error}`);
  });
