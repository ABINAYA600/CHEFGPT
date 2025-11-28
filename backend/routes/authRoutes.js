import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/profile", protect, getProfile);
// RESET PASSWORD (no email OTP, simple version)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ success: false, message: "Email & password required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});



export default router;
