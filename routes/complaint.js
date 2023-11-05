const express = require("express");
const Complaint = require("../models/complaint.model");
const router = express.Router();

// Create a route to add a new complaint
router.route("/complaints").post((req, res) => {
    console.log("inside the complaint");
    const complaint = new Complaint({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        image: req.body.image,
        description: req.body.description,

    });
    complaint
        .save()
        .then(() => {
            console.log("Complaint registered");
            res.status(200).json("ok");
        })
        .catch((err) => {
            res.status(422).json({
                msg: err,
            });
        });
    // res.json("registered");
});

// Create a route to get a list of all complaints
router.route("/:email").get(async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ email: req.params.email });

        if (!complaint) {
            return res.status(404).json({
                msg: "Complaint not found",
            });
        }
        res.json({
            msg: "Complaint found",
            complaint: complaint,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes.
        res.status(500).json({
            msg: "Error",
            error: err.message, // Use err.message to get the error message.
        });
    }
});

//--------------------------------delete Complaint -----------------
router.delete("/delete/:email", async (req, res) => {
    try {
        const complaint = await Complaint.findOneAndDelete({ email: req.params.email });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint successfully deleted" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
});
//--------------------------------- Update Complaint ---------------//
router.route("/update/:email").patch(async (req, res) => {
    Complaint.findOneAndUpdate(
        { email: req.params.email },
        { $set: { name: req.body.name } },
        { $set: { phoneNumber: req.body.phoneNumber } },
        { $set: { address: req.body.address } },
        { $set: { image: req.body.image } },
        { $set: { description: req.body.description } },
    )
        .then(() => {
            res.json({
                msg: "Complaint successfully updated",
                email: req.params.email,
            });
        })
        .catch((err) => {
            res.status(403).json({
                msg: "Complaint update failed",
                error: err,
            });
        });
});
module.exports = router;
