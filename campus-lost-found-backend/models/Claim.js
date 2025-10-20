// models/Claim.js
import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proof: {
    type: String,
    required: true,
  },
  claimStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
});

const Claim = mongoose.model("Claim", claimSchema);

// ✅ ESM default export
export default Claim;
