//model banane ke liye haame 2 chiz required hoti, 
//ek naam of model
//second schema, schema banane ke liye hame mongoose ki need hoti
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Not required for Google users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple docs with undefined googleId
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Visitor"],
        default: "Visitor",
    },
});

//hamne schema define kr diya, ab model create krke export krna h

module.exports = mongoose.model("user",userSchema);