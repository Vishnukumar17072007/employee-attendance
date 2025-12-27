const express = require("express");
const path = require("path");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public pages
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/register.html"));
});

// 🔐 Protected pages
router.get("/employee", auth, role("employee"), (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/employee.html"));
});

router.get("/admin", auth, role("admin"), (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/admin.html"));
});

module.exports = router;
