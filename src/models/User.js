const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    // 🔐 OPTIONAL (for password login)
    password: {
        type: String
    },

    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    },

    // 🔑 OTP AUTH FIELDS
    otp: {
        type: String
    },

    otpExpires: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    phone: {
        type: String,
        unique: true,
        sparse: true
    }
    
    
});

module.exports = mongoose.model("User", userSchema);
