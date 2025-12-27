const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");

// REGISTER
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.send("Registration successful");
    } catch (err) {
        res.status(500).send("Server error");
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { 
              id: user._id, 
              role: user.role, 
              name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🔐 STORE JWT IN COOKIE
        res.cookie("token", token, {
            httpOnly: true,   // JS cannot access
            secure: true,     // HTTPS only
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            role: user.role
        });
        
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.requestOtp = async (req, res) => {
    console.log("🔥 requestOtp HIT");
    console.log("REQ BODY:", req.body);

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 🚨 TEMPORARY (DEV ONLY)
    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.json({ role: user.role });
};
