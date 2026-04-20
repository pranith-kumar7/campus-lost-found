import express from "express";
import User from "../models/User.js";
import { uploadCollegeId } from "../middleware/upload.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup route
router.post("/signup", uploadCollegeId.single("collegeId"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "College ID is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      name,
      email,
      password,
      role: role || "student",
      idCard: file.path,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.status(200).json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  },
  token, // <-- include token
});

export default router;
