const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

