import Claim from "../models/Claim.js";
import Item from "../models/Item.js";

// POST /api/claims/item/:id
export const claimItem = async (req, res) => {
  try {
    const { id } = req.params;        // item ID
    const { reason, proof } = req.body;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Prevent duplicate claims by same user
    const existing = await Claim.findOne({ item: id, claimedBy: req.user._id });
    if (existing) return res.status(400).json({ message: "You already claimed this item" });

    const claim = await Claim.create({
      item: id,
      claimedBy: req.user._id,
      reason,
      proof,
    });

    res.status(201).json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while claiming item" });
  }
};

// GET /api/claims/my-claims
export const getClaimsByUser = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate("item", "name description proofImage")
      .populate("claimedBy", "name email phone");
    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your claims" });
  }
};

// GET /api/claims/pending (Admin only)
export const getPendingClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimStatus: "Pending" })
      .populate("item", "name description proofImage")
      .populate("claimedBy", "name email phone");
    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending claims" });
  }
};

// PUT /api/claims/:claimId/verify (Admin only)
export const verifyClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.claimStatus = req.body.status;
    await claim.save();

    res.json({ message: `Claim ${status.toLowerCase()} successfully!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update claim" });
  }
};
