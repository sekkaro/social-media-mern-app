const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const userPng = require("../utilsServer/userPng");
const { regexUserName } = require("../utilsServer/constants");

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    if (username.length < 1 || !regexUserName.test(username)) {
      return res.status(401).send("Invalid");
    }

    const user = await UserModel.findOne({ username: username.toLowerCase() });

    if (user) return res.status(401).send("Username already taken");

    return res.status(200).send("Available");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    bio,
    facebook,
    youtube,
    twitter,
    instagram,
  } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  if (password.length < 6)
    return res.status(401).send("Password must be at least 6 characters");

  try {
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) return res.status(401).send("User already registered");

    user = new UserModel({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      profilePicUrl: req.body.profilePicUrl || userPng,
    });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const profile = new ProfileModel({
      user: user._id,
      bio,
      social: {
        youtube: youtube && youtube,
        facebook: facebook && facebook,
        twitter: twitter && twitter,
        instagram: instagram && instagram,
      },
    });

    await profile.save();

    const follower = new FollowerModel({
      user: user._id,
      followers: [],
      following: [],
    });

    await follower.save();

    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(token);
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
