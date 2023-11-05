const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create schema for ngo
const Ngo = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },  
    address: { type: String, required: false },
    phoneNumber: { type: Number, required: false },
    licence: { type: String, required: false },
    password: { type: String, required: true },
});
module.exports = mongoose.model("Ngo", Ngo);

