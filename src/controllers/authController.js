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

    res.json({ message: "OTP sent" });
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, phone, otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        // 🔍 Find user by email OR phone
        const user = await User.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean)
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: "No OTP found. Request OTP again." });
        }

        // ⏰ Check expiry
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // 🔐 VERY IMPORTANT: bcrypt compare (string vs hash)
        const isMatch = await bcrypt.compare(String(otp), user.otp);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ OTP verified → clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // 🎟️ Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🍪 Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.json({ role: user.role });

    } catch (err) {
        console.error("VERIFY OTP ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

//request OTP
const sendEmail = require("../utils/sendEmail");

exports.requestOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 📧 SEND OTP EMAIL
    await sendEmail(
        email,
        "Your Login OTP",
        `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    res.json({ message: "OTP sent to email" });
};

//Sms OTP
const sendSms = require("../utils/sendSms");

exports.requestMobileOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone number required" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ✅ ADD THIS CHECK HERE
        if (!user.phone) {
            return res.status(400).json({ message: "Phone number not registered" });
        }

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendSms(
            user.phone,
            `Your OTP is ${otp}. It expires in 5 minutes.`
        );

        res.json({ message: "OTP sent to mobile" });

    } catch (err) {
        console.error("SMS OTP ERROR:", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

//sent OTP via whatsapp
const sendWhatsApp = require("../utils/sendWhatsApp");

exports.requestWhatsAppOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone number required" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(String(otp), 10);

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendWhatsApp(
            phone,
            `🔐 Your OTP is *${otp}*\nIt expires in 5 minutes.`
        );

        res.json({ message: "OTP sent via WhatsApp" });

    } catch (err) {
        console.error("WHATSAPP OTP ERROR:", err);
        res.status(500).json({ message: "Failed to send WhatsApp OTP" });
    }
};
