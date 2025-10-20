import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  proof: { type: String, required: true },
  claimStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  claimedAt: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  reportedAt: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true, enum: ["Lost", "Found"] },
  category: { type: String, required: true },
  contact: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  proofImage: { type: String },
  status: { type: String, enum: ["Pending", "Verified", "Resolved"], default: "Pending" },
  claims: [claimSchema],
  reports: [reportSchema],
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
