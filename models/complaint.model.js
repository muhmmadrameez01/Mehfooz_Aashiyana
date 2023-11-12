const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: String,
    address: String,
    description: String,
    imageUrl: String // Storing the URL of the image in AWS S3
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
