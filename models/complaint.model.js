const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create schema for ngo
const Complaint = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: Number, required: false },  
    address: { type: String, required: false },
     image: { type: String, required: true },
    description: { type: String, required: true },
    
    
    
});
module.exports = mongoose.model("Complaint", Complaint);