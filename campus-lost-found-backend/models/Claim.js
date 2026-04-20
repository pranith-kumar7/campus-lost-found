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
  contact: {
    type: String,
    required: true,
  },
  reason: {
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
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  unreadByClaimant: {
    type: Number,
    default: 0,
  },
  unreadByReporter: {
    type: Number,
    default: 0,
  },
  unreadByAdmin: {
    type: Number,
    default: 0,
  },
  lastMessageAt: {
    type: Date,
    default: null,
  },
});

const Claim = mongoose.model("Claim", claimSchema);

// ✅ ESM default export
export default Claim;
