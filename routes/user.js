const express = require("express");
const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

const router = express.Router();
//-----------------------Get Email------------------------------------------
router.get("/:email", middleware.checkToken, async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.json({
      msg: "User found",
      user: existingUser,
    });
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//------------------------LOGIN----------------------------------------------

router.route("/login").post((req, res) => {
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        res.status(403).json({ msg: "Email incorrect" });
      } else if (result.password === req.body.password) {
        let token = jwt.sign({ email: req.body.email }, config.key, {
          expiresIn: "24h",
        }); //
        res.json({
          token: token,
          msg: "Login successful",
        });
      } else {
        res.status(403).json({ msg: "Password incorrect" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: err });
    });
});

//------------------------REGISTRATION---------------------------------------

router.route("/register").post((req, res) => {
  console.log("inside the register");
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  user
    .save()
    .then(() => {
      console.log("User registered");
      res.status(200).json("ok");
    })
    .catch((err) => {
      res.status(403).json({
        msg: err,
      });
    });
  res.json("registered");
});

router.patch("/update/:email", middleware.checkToken, (req, res) => {
  User.findOneAndUpdate(
    { email: req.params.email },
    { $set: { password: req.body.password } }
  )
    .then(() => {
      res.json({
        msg: "Password successfully updated",
        email: req.params.email,
      });
    })
    .catch((err) => {
      res.status(403).json({
        msg: "Password update failed",
        error: err,
      });
    });
});

router.delete("/delete/:email", middleware.checkToken, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Email successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
