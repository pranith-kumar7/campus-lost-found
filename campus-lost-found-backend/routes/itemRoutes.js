import express from "express";
import fs from "fs";
import Item from "../models/Item.js";
import multer from "multer";
import { verifyToken} from "../middleware/adminAuth.js";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  verifyItem,
  claimItem,
  verifyClaim,
  reportItem,
  resolveReport,
} from "../controllers/itemController.js";
import { protect, verifiedUser, admin } from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed!"), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Public routes
router.get("/", getItems);

// Create new item

// Single item routes
router.route("/:id")
  .get(protect, getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

// Admin verify
router.put("/:id/verify", protect, admin, verifyItem);

// Claims
router.post("/:id/claim", protect, verifiedUser, (req, res, next) => {
  upload.single("proof")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (req.file) req.body.proof = `uploads/${req.file.filename}`;
    await claimItem(req, res, next);
  });
});
router.put("/:id/claim/verify", protect, admin, verifyClaim);

// Reports
router.post("/:id/report", protect, verifiedUser, async (req, res, next) => {
  await reportItem(req, res, next);
});
router.put("/:id/report/resolve", protect, admin, async (req, res, next) => {
  await resolveReport(req, res, next);
});

router.post("/:id/claim", verifyToken, claimItem);

router.post("/",protect, verifiedUser, upload.single("itemImage"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, type, category, description,contact } = req.body;

    if (!name || !type || !category || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }
     // Make sure protect middleware sets req.user
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized: user info missing" });
      }

    const newItem = new Item({
      name,
      type,
      category,
      description,
      contact,
      proofImage: req.file ? req.file.path.replace(/\\/g, "/"): null,
      reportedBy: req.user._id,
    });

    await newItem.save();
    const populatedItem = await newItem.populate("reportedBy", "name email phone");
    res.status(201).json({ message: "Item created successfully", newItem });
  } catch (err) {
    console.error("Report item error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
