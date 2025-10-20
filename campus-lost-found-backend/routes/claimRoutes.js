import express from "express";
import Claim from "../models/Claim.js";
// import { verifyToken } from "../middleware/adminAuth.js"; // temporarily disabled

const router = express.Router();

// GET all pending claims (admin-only temporarily bypassed)
router.get("/pending", async (req, res) => {
  try {
    const claims = await Claim.find({ claimStatus: "Pending" })
      .populate("item", "name description category")
      .populate("claimedBy", "name email phone");

    res.json(claims);
  } catch (err) {
    console.error("Fetch pending claims error:", err);
    res.status(500).json({ message: "Failed to fetch pending claims" });
  }
});

// PUT /api/claims/:claimId/verify
router.put("/:claimId/verify", async (req, res) => {
  try {
    const { claimId } = req.params;     
    const { status } = req.body; // expected: "Approved" or "Rejected"

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.claimStatus = status;
    await claim.save();

    res.json({ message: `Claim ${status} successfully!` });
  } catch (err) {
    console.error("Verify claim error:", err);
    res.status(500).json({ message: "Failed to update claim" });
  }
});

// GET /api/claims/user/:userId — Get all claims by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const claims = await Claim.find({ claimedBy: userId })
      .populate("item", "name description category")
      .populate("claimedBy", "name email");

    res.json(claims);
  } catch (err) {
    console.error("Fetch user claims error:", err);
    res.status(500).json({ message: "Failed to fetch user claims" });
  }
});


export default router;
