import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// ===== Get all users (admin only) =====
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ===== Verify a student =====
router.put("/users/:id/verify", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    console.error("❌ Error verifying user:", err);
    res.status(500).json({ message: "Failed to verify user" });
  }
});

// ===== Reject a student verification =====
router.put("/users/:id/reject", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = false;
    await user.save();

    res.json({ message: "User verification rejected" });
  } catch (err) {
    console.error("❌ Error rejecting verification:", err);
    res.status(500).json({ message: "Failed to reject verification" });
  }
});

export default router;
