import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import Item from "../models/Item.js";
import {
  createItem, getItems, getItemById, updateItem, deleteItem,
  verifyItem, claimItem, verifyClaim, reportItem, resolveReport,
  getMyReports, getMyItems,
} from "../controllers/itemController.js";
import { protect, verifiedUser, admin } from "../middleware/auth.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "items", allowed_formats: ["jpg", "jpeg", "png"] },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files allowed"), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.get("/", getItems);
router.get("/mine", protect, getMyItems);
router.get("/reports/my", protect, getMyReports);

router.route("/:id")
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.put("/:id/verify", protect, admin, verifyItem);

router.post("/:id/claim", protect, upload.single("proof"), async (req, res, next) => {
  if (req.file) req.body.proof = req.file.path;
  await claimItem(req, res, next);
});

router.put("/:id/claim/verify", protect, admin, verifyClaim);

router.post("/:id/report", protect, verifiedUser, reportItem);
router.put("/:id/report/resolve", protect, admin, resolveReport);

router.post("/", protect, verifiedUser, upload.single("itemImage"), async (req, res) => {
  try {
    const { name, type, category, description, contact } = req.body;
    if (!name || !type || !category || !contact)
      return res.status(400).json({ message: "Missing required fields" });
    if (!req.user?._id)
      return res.status(401).json({ message: "Unauthorized" });
    const newItem = new Item({
      name, type, category, description, contact,
      proofImage: req.file ? req.file.path : null,
      reportedBy: req.user._id,
    });
    await newItem.save();
    await newItem.populate("reportedBy", "name email phone");
    res.status(201).json({ message: "Item created successfully", newItem });
  } catch (err) {
    console.error("Report item error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
