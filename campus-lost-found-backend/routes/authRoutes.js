import express from "express";
import User from "../models/User.js";
import { uploadCollegeId } from "../middleware/upload.js";

const router = express.Router();

// ================== SIGNUP ==================
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
      idCard: `uploads/collegeIds/${file.filename}`, // ✅ correct path
      isVerified: role === "admin" ? true : false,
    });

    await user.save();

    res.status(201).json({
      message:
        role === "admin"
          ? "Admin account created successfully. You can log in now."
          : "Signup successful! Please wait for admin verification before logging in.",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Students must be verified before login
    if (user.role === "student" && !user.isVerified) {
      return res.status(403).json({ message: "Your account is not verified yet" });
    }

    // Don't send password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ================== GET ALL UNVERIFIED USERS (Admin only) ==================
router.get("/unverified", async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ role: "student", isVerified: false }).select("-password");
    res.status(200).json(unverifiedUsers);
  } catch (err) {
    console.error("Fetch unverified users error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ================== VERIFY A STUDENT (Admin only) ==================
router.put("/verify/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student") return res.status(400).json({ message: "Only students need verification" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully", user });
  } catch (err) {
    console.error("Verify user error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET single user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
