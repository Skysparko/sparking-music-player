const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const User = require("../models/userModel");
const Transporter = require("../services/email");
require("dotenv").config();

const router = express.Router();

// @route   POST api/v1/user/signup
// @desc    Register user
// @access  Public

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        err: "Invalid user name: name must be longer than two characters and must not include any numbers or special characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Error: Invalid email" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        err: "Error: Invalid password: password must be at least 8 characters long and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

    const userID = uuidv4();
    const userDetails = {
      userID,
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userDetails);
    await newUser.save();

    console.log(newUser);
    return res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   POST api/v1/user/signin
// @desc    Login user
// @access  Public

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ err: "Please enter your email" });
    }
    if (!password) {
      return res.status(400).json({ err: "Please enter your password" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ err: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ err: "email or password is incorrect" });
    }

    console.log(existingUser, existingUser.userID);
    const payload = { user: { id: existingUser.userID } };
    const bearerToken = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: 360000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    console.log("Logged in successfully");

    return res.status(200).json({ msg: "Signed-In successfully", bearerToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   GET api/v1/user/signout
// @desc    Logout user
// @access  Public

router.get("/signout", (_req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ msg: "Signed-Out successfully" });
});

//@route POST api/v1/user/forget-password
//@desc Forgot password
//@access Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(403).send("please enter valid email");
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).send("User not found");
    }

    const payload = { userID: userExists.userID };
    const forgotToken = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: 360000,
    });

    const resetLink = `${process.env.APP_URL}/api/v1/user/forgot-password/${forgotToken}`;

    const mailOptions = {
      from: "shubhamrakhecha5@gmail.com",
      to: email,
      cc: [],
      bcc: [],
      subject: "password reset",
      html: `<h1>Want to change your password right??</h1><p>If you send this request then click on reset password to reset your password or just ignore it</p><a href="${resetLink}">reset password</a>`,
    };

    Transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sended with=", info);
      }
    });

    return res.status(200).send("email sent sucessfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.put("/forgot-password/:userID", async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.userID, process.env.SECRET);
    const user = await User.findOne({ userID: decodedToken.userID });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const { password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        err: "Error: Invalid password: password must be at least 8 characters long and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

    user.password = hashedPassword;

    await user.save();

    return res.status(200).send("password changed sucessfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;
