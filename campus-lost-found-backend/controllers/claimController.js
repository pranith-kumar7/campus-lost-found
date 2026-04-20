import mongoose from "mongoose";
import Claim from "../models/Claim.js";
import Item from "../models/Item.js";

const isSameId = (a, b) => String(a) === String(b);

const loadClaimWithContext = async (claimId) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) return null;

  return Claim.findById(claimId)
    .populate("claimedBy", "name email phone role")
    .populate("messages.sender", "name email role")
    .populate({
      path: "item",
      select: "name description proofImage category reportedBy contact status type",
      populate: {
        path: "reportedBy",
        select: "name email phone role isVerified",
      },
    });
};

const computeUnreadCount = (claim, user) => {
  const reporterId = claim.item?.reportedBy?._id;

  if (user.role === "admin") return claim.unreadByAdmin || 0;
  if (reporterId && isSameId(reporterId, user._id)) return claim.unreadByReporter || 0;
  return claim.unreadByClaimant || 0;
};

const serializeClaim = (claim, user) => {
  const plain = claim.toObject ? claim.toObject() : claim;
  return {
    ...plain,
    unreadCount: computeUnreadCount(plain, user),
  };
};

const ensureAccess = (claim, user) => {
  if (!claim) {
    return { allowed: false, status: 404, message: "Claim not found" };
  }

  const reporterId = claim.item?.reportedBy?._id;
  const isAdminUser = user.role === "admin";
  const isClaimant = isSameId(claim.claimedBy?._id || claim.claimedBy, user._id);
  const isReporter = reporterId && isSameId(reporterId, user._id);

  if (!isAdminUser && !isClaimant && !isReporter) {
    return { allowed: false, status: 403, message: "You do not have access to this conversation" };
  }

  return { allowed: true, reporterId, isAdminUser, isClaimant, isReporter };
};

export const getClaimsByUser = async (req, res) => {
  try {
    const reportedItemIds = await Item.find({ reportedBy: req.user._id }).distinct("_id");

    const claims = await Claim.find({
      $or: [
        { claimedBy: req.user._id },
        { item: { $in: reportedItemIds } },
      ],
    })
      .populate("claimedBy", "name email phone role")
      .populate("messages.sender", "name email role")
      .populate({
        path: "item",
        select: "name description proofImage category reportedBy contact status type",
        populate: {
          path: "reportedBy",
          select: "name email phone role isVerified",
        },
      })
      .sort({ lastMessageAt: -1, claimedAt: -1 });

    const uniqueClaims = claims.filter(
      (claim, index, arr) => arr.findIndex((entry) => String(entry._id) === String(claim._id)) === index
    );

    res.json(uniqueClaims.map((claim) => serializeClaim(claim, req.user)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your claims" });
  }
};

export const getPendingClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimStatus: "Pending" })
      .populate("claimedBy", "name email phone role")
      .populate("messages.sender", "name email role")
      .populate({
        path: "item",
        select: "name description proofImage category reportedBy contact status type",
        populate: {
          path: "reportedBy",
          select: "name email phone role isVerified",
        },
      })
      .sort({ lastMessageAt: -1, claimedAt: -1 });

    res.json(claims.map((claim) => serializeClaim(claim, req.user)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending claims" });
  }
};

export const verifyClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.claimStatus = status;
    claim.messages.push({
      sender: req.user._id,
      text: `Claim status updated to ${status}.`,
    });
    claim.unreadByClaimant += 1;
    claim.unreadByReporter += 1;
    claim.lastMessageAt = new Date();
    await claim.save();

    res.json({ message: `Claim ${status.toLowerCase()} successfully!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update claim" });
  }
};

export const getClaimMessages = async (req, res) => {
  try {
    const claim = await loadClaimWithContext(req.params.claimId);
    const access = ensureAccess(claim, req.user);

    if (!access.allowed) {
      return res.status(access.status).json({ message: access.message });
    }

    res.json(serializeClaim(claim, req.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch claim messages" });
  }
};

export const addClaimMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const claim = await loadClaimWithContext(req.params.claimId);
    const access = ensureAccess(claim, req.user);

    if (!access.allowed) {
      return res.status(access.status).json({ message: access.message });
    }

    claim.messages.push({
      sender: req.user._id,
      text: text.trim(),
    });
    claim.lastMessageAt = new Date();

    if (access.isAdminUser) {
      claim.unreadByClaimant += 1;
      claim.unreadByReporter += 1;
    } else if (access.isReporter) {
      claim.unreadByClaimant += 1;
      claim.unreadByAdmin += 1;
    } else {
      claim.unreadByReporter += 1;
      claim.unreadByAdmin += 1;
    }

    await claim.save();

    const updatedClaim = await loadClaimWithContext(req.params.claimId);
    res.status(201).json(serializeClaim(updatedClaim, req.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const markClaimAsRead = async (req, res) => {
  try {
    const claim = await loadClaimWithContext(req.params.claimId);
    const access = ensureAccess(claim, req.user);

    if (!access.allowed) {
      return res.status(access.status).json({ message: access.message });
    }

    if (access.isAdminUser) {
      claim.unreadByAdmin = 0;
    } else if (access.isReporter) {
      claim.unreadByReporter = 0;
    } else {
      claim.unreadByClaimant = 0;
    }

    await claim.save();
    res.json({ message: "Conversation marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update unread state" });
  }
};
