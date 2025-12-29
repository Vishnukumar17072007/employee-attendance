const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/request-otp", authController.requestOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.json({ message: "Logged out successfully" });
});
router.post("/request-mobile-otp", authController.requestMobileOtp);
router.post("/request-whatsapp-otp", authController.requestWhatsAppOtp);


module.exports = router;
