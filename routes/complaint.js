const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint.model');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configuring AWS
AWS.config.update({
    accessKeyId: 'AKIA5ZBIV4KPCLPCVWN5',
    secretAccessKey: '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',
    region: 'eu-north-1'
});

const s3 = new AWS.S3();

// Configuring Multer to store the image directly in S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'imagestoreage',
        // acl: 'public-read', // Adjust permissions as needed
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

// Register a complaint with an image upload
router.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const { name, email, phoneNumber, address, description } = req.body;

        const newComplaint = new Complaint({

            name,
            email,
            phoneNumber,
            address,
            description,
            imageUrl: req.file.location // Accessing the location property of the uploaded file
        });

        await newComplaint.save();
        res.status(201).json({ message: 'Complaint registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the complaint' });
        console.log(error);
    }
});

// Other routes for GET, DELETE, UPDATE as needed
router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching complaints' });
    }
});

// Get a single complaint by email
router.get('/complaints/:email', async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ email: req.params.email });
        if (!complaint) {
            res.status(404).json({ message: 'Complaint not found' });
        } else {
            res.status(200).json(complaint);
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the complaint' });
    }
});

// Delete a complaint by email
router.delete('/complaints/:email', async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findOneAndDelete({ email: req.params.email });
        if (!deletedComplaint) {
            res.status(404).json({ message: 'Complaint not found' });
        } else {
            res.status(200).json({ message: 'Complaint successfully deleted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the complaint' });
    }
});

// Update a complaint by email
router.patch('/complaints/:email', async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { email: req.params.email },
            { $set: req.body }, // You might want to perform more precise field updates
            { new: true }
        );
        if (!updatedComplaint) {
            res.status(404).json({ message: 'Complaint not found' });
        } else {
            res.status(200).json({ message: 'Complaint successfully updated', updatedComplaint });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the complaint' });
    }
});

module.exports = router;
