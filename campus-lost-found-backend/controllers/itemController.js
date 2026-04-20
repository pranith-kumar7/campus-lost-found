import Item from "../models/Item.js";
import Claim from "../models/Claim.js";

const hydrateClaims = async (itemDoc) => {
  const item = itemDoc.toObject ? itemDoc.toObject() : itemDoc;
  const claims = await Claim.find({ item: item._id })
    .populate("claimedBy", "name email phone role")
    .populate("messages.sender", "name email role")
    .sort({ lastMessageAt: -1, claimedAt: -1 })
    .lean();
  item.claims = claims.map((claim) => ({
    ...claim,
    unreadCount: claim.unreadByAdmin || 0,
  }));
  return item;
};

export const createItem = async (req, res, next) => {
  try {
    const { name, description, type, category, contact, proofImage } = req.body;

    if (!name || !type || !category || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = new Item({
      name,
      description,
      type,
      category,
      contact,
      reportedBy: req.user?._id,
      proofImage: proofImage || null,
    });

    const savedItem = await newItem.save();
    await savedItem.populate("reportedBy", "name email");
    await savedItem.populate("reports.reportedBy", "name email");
    const populatedItem = await hydrateClaims(savedItem);

    res.status(201).json(populatedItem);
  } catch (err) {
    console.error("Create Item Error:", err);
    next(err);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find({ status: "Verified" });
    const hydratedItems = await Promise.all(items.map((item) => hydrateClaims(item)));
    res.status(200).json(hydratedItems);
  } catch (err) {
    next(err);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({ status: "Verified" })
      .populate("reportedBy", "name email phone isVerified role")
      .populate("reports.reportedBy", "name email phone");

    const hydratedItems = await Promise.all(items.map((item) => hydrateClaims(item)));
    res.status(200).json(hydratedItems);
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "name email phone isVerified role")
      .populate("reports.reportedBy", "name email phone");

    if (!item) return res.status(404).json({ message: "Item not found" });

    const hydratedItem = await hydrateClaims(item);
    res.status(200).json(hydratedItem);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("reportedBy", "name email")
      .populate("reports.reportedBy", "name email");

    const populatedItem = await hydrateClaims(updatedItem);
    res.status(200).json(populatedItem);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    await Claim.deleteMany({ item: req.params.id });
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};

export const verifyItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "Verified";
    await item.save();

    await item.populate("reportedBy", "name email");
    await item.populate("reports.reportedBy", "name email");
    const populatedItem = await hydrateClaims(item);

    res.status(200).json(populatedItem);
  } catch (err) {
    next(err);
  }
};

export const claimItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "name email phone role");

    if (!item) return res.status(404).json({ message: "Item not found" });

    const { contact, reason, proof } = req.body;
    if (!contact || !reason || !proof) {
      return res.status(400).json({ message: "Contact, reason, and proof are required to submit a claim." });
    }

    const existingClaim = await Claim.findOne({ item: item._id, claimedBy: req.user?._id });
    if (existingClaim) {
      return res.status(400).json({ message: "You already claimed this item" });
    }

    await Claim.create({
      item: item._id,
      claimedBy: req.user?._id,
      proof,
      contact,
      reason,
      claimStatus: "Pending",
      messages: [
        {
          sender: req.user._id,
          text: `Claim created: ${reason}`,
        },
      ],
      unreadByReporter: 1,
      unreadByAdmin: 1,
      lastMessageAt: new Date(),
    });

    const claims = await Claim.find({ item: item._id })
      .populate("claimedBy", "name email phone role")
      .populate("messages.sender", "name email role")
      .sort({ lastMessageAt: -1, claimedAt: -1 });

    res.status(200).json({
      message: "Claim submitted",
      item,
      claims,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyClaim = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const claim = await Claim.findOne({ _id: req.body.claimId, item: item._id });
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.claimStatus = req.body.status;
    claim.messages.push({
      sender: req.user._id,
      text: `Claim status updated to ${req.body.status}.`,
    });
    claim.unreadByClaimant += 1;
    claim.unreadByReporter += 1;
    claim.lastMessageAt = new Date();
    await claim.save();

    await item.populate([{ path: "reportedBy", select: "name email" }, { path: "reports.reportedBy", select: "name email" }]);
    const populatedItem = await hydrateClaims(item);

    res.status(200).json({ message: "Claim verified", item: populatedItem });
  } catch (err) {
    next(err);
  }
};

export const reportItem = async (req, res, next) => {
  try {
    const { message, contact } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const newReport = {
      reportedBy: req.user?._id,
      reason: message || "",
      contact: contact || "",
      status: "Pending",
      reportedAt: Date.now(),
    };

    item.reports.push(newReport);
    await item.save();

    await item.populate("reportedBy", "name email");
    await item.populate("reports.reportedBy", "name email");
    const populatedItem = await hydrateClaims(item);

    res.status(201).json({ message: "Item reported successfully!", item: populatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to report item." });
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const report = item.reports.id(req.body.reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "Resolved";
    await item.save();

    await item.populate([
      { path: "reportedBy", select: "name email" },
      { path: "reports.reportedBy", select: "name email" },
    ]);
    const populatedItem = await hydrateClaims(item);

    res.status(200).json({ message: "Report resolved", item: populatedItem });
  } catch (err) {
    next(err);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const items = await Item.find({ "reports.reportedBy": req.user._id })
      .populate("reportedBy", "name email phone isVerified role")
      .populate("reports.reportedBy", "name email phone role");

    const reports = items.flatMap((itemDoc) => {
      const item = itemDoc.toObject ? itemDoc.toObject() : itemDoc;
      return (item.reports || [])
        .filter((report) => String(report.reportedBy?._id || report.reportedBy) === String(req.user._id))
        .map((report) => ({
          ...report,
          item: {
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            type: item.type,
            status: item.status,
            proofImage: item.proofImage,
            contact: item.contact,
            reportedBy: item.reportedBy,
          },
        }));
    });

    reports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
};

export const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .populate("reportedBy", "name email phone isVerified role")
      .populate("reports.reportedBy", "name email phone role")
      .sort({ createdAt: -1 });

    const hydratedItems = await Promise.all(items.map((item) => hydrateClaims(item)));
    res.status(200).json(hydratedItems);
  } catch (err) {
    next(err);
  }
};



