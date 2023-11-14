const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const Ngo = require("../models/ngo.model");
const router = express.Router();

//--------------------NGO Register -------------------------------------//
router.route("/register").post((req, res) => {
    console.log("inside the register");
    const ngo = new Ngo({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        licence: req.body.licence,
        password: req.body.password,

    });
    ngo
        .save()
        .then(() => {
            console.log("NGO registered");
            res.status(200).json("ok");
        })
        .catch((err) => {
            res.status(422).json({
                msg: err,
            });
        });
    // res.json("registered");
});
router.route('/register').get(async (req, res) => {
    try {
      // Retrieve all users from the database
      const ngo = await Ngo.find();
  
      // Send the users as JSON response
      res.json(ngo);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
//--------------------------------------- NGO Login ------------------------------------//
router.route("/login").post((req, res) => {
    console.log("inside the login");
    Ngo.findOne({ email: req.body.email })
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
                console.log("Ngo login");
            } else {
                res.status(403).json({ msg: "Password incorrect" });
            }
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });
});
//------------------------Update NGO---------------------------
router.route("/update/:email").patch(middleware.checkToken, async (req, res) => {
    Ngo.findOneAndUpdate(
        { email: req.params.email },
        { $set: { password: req.body.password } },
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
//----------------------- Delete NGO -----------------------------
router.delete("/delete/:email", middleware.checkToken, async (req, res) => {
    try {
        const ngo = await Ngo.findOneAndDelete({ email: req.params.email });

        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }

        res.status(200).json({ message: "Email successfully deleted" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
});
//---------------------- get Email ------------------------------
router.route("/:email").get(middleware.checkToken, async (req, res) => {
    try {
        const ngo = await Ngo.findOne({ email: req.params.email });

        if (!ngo) {
            return res.status(404).json({
                msg: "NGO not found",
            });
        }

        // Retrieve the token from the request headers
        const token = req.headers.authorization.slice(7);

        // Set the token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Set to true for HTTPS
        });

        res.json({
            msg: "NGO found",
            ngo: ngo,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes.
        res.status(500).json({
            msg: "Error",
            error: err.message, // Use err.message to get the error message.
        });
    }
});
router.get('/checkemail/:email', async (req, res) => {
    try {
      const result = await Ngo.findOne({ email: req.params.email });
      if (result !== null) {
        return res.json({
          Status: true,
        });
      } else {
        return res.json({ Status: false });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  })
module.exports = router;