const express = require("express");
const Complaint = require("../models/complaint.model");
const router = express.Router();
const multer = require('multer');

// Create a route to add a new complaint
const storage = multer.memoryStorage(); // Store the image in memory (you can change this to disk storage if needed)


// Multer middleware for image upload
const upload = multer({ dest: 'uploads/' });
router.post('/complaints', upload.single('image'), async (req, res) => {
    console.log('Inside the complaint');

    try {

        const complaintData = {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            description: req.body.description,
            image: req.body.image,
        };

        const complaint = new Complaint(complaintData);
        console.log('Request Body:', req.body);


        await complaint.save();
        console.log('Complaint registered');
        res.status(200).json('ok');
    } catch (err) {
        console.error('Error:', err);
        res.status(422).json({ msg: err.message });
    }
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
router.patch("/update/:email", async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { email: req.params.email },
            {
                $set: {
                    name: req.body.name,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    image: req.body.image,
                    description: req.body.description,
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "Complaint successfully updated",
            email: req.params.email,
            updatedComplaint: updatedComplaint,
        });
    } catch (err) {
        res.status(500).json({ error: "An error occurred", msg: err.message });
    }
});

module.exports = router;
