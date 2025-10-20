  import Item from "../models/Item.js";
  import Claim from "../models/Claim.js"; // make sure Claim model exists


  // Create new item
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

      const populatedItem = await savedItem
        .populate("reportedBy", "name email")
        .populate("claims.claimedBy", "name email")
        .populate("reports.reportedBy", "name email")
        .execPopulate();

      res.status(201).json(populatedItem);
    } catch (err) {
      console.error("Create Item Error:", err);
      next(err);
    }
  };

  // Get all items
  export const getItems = async (req, res, next) => {
    try {
      const items = await Item.find()
        .populate("reportedBy", "name email phone")
        .populate("claims.claimedBy", "name email phone")
        .populate("reports.reportedBy", "name email phone");

      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  };

  // Get single item
  export const getItemById = async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id)
        .populate("reportedBy", "name email phone")
        .populate("claims.claimedBy", "name email phone")
        .populate("reports.reportedBy", "name email phone");

      if (!item) return res.status(404).json({ message: "Item not found" });

      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };

  // Update item
  export const updateItem = async (req, res, next) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

      const populatedItem = await updatedItem
        .populate("reportedBy", "name email")
        .populate("claims.claimedBy", "name email")
        .populate("reports.reportedBy", "name email")
        .execPopulate();

      res.status(200).json(populatedItem);
    } catch (err) {
      next(err);
    }
  };

  // Delete item
  export const deleteItem = async (req, res, next) => {
    try {
      await Item.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Item deleted" });
    } catch (err) {
      next(err);
    }
  };

  // Admin verify item
  export const verifyItem = async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });

      item.status = "Verified";
      await item.save();

      const populatedItem = await item
        .populate("reportedBy", "name email")
        .populate("claims.claimedBy", "name email")
        .populate("reports.reportedBy", "name email")
        .execPopulate();

      res.status(200).json(populatedItem);
    } catch (err) {
      next(err);
    }
  };

  // Claim item
export const claimItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "name email"); // only populate fields that exist on Item

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Create new claim in Claim collection
    const newClaim = await Claim.create({
      item: item._id,
      claimedBy: req.user?._id,
      proof: req.body.proof || null,
      claimStatus: "Pending",
    });

    // Fetch all claims for this item to return in response
    const claims = await Claim.find({ item: item._id }).populate(
      "claimedBy",
      "name email"
    );

    res.status(200).json({
      message: "Claim submitted",
      item,
      claims,
    });
  } catch (err) {
    next(err);
  }
};


  // Verify claim
  export const verifyClaim = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const claim = item.claims.id(req.body.claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.claimStatus = req.body.status; // "Approved" or "Rejected"
    await item.save();

    // Populate all required paths correctly
    const populatedItem = await item.populate([
      { path: "reportedBy", select: "name email" },
      { path: "claims.claimedBy", select: "name email" },
      { path: "reports.reportedBy", select: "name email" }
    ]);

    res.status(200).json({ message: "Claim verified", item: populatedItem });
  } catch (err) {
    next(err);
  }
};


  // Report item
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

      const populatedItem = await item
        .populate("reportedBy", "name email")
        .populate("claims.claimedBy", "name email")
        .populate("reports.reportedBy", "name email")
        .execPopulate();

      res.status(201).json({ message: "Item reported successfully!", item: populatedItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to report item." });
    }
  };

  // Resolve report
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
  { path: "claims.claimedBy", select: "name email" },
  { path: "reports.reportedBy", select: "name email" },
]);

      res.status(200).json({ message: "Report resolved", item: populatedItem });
    } catch (err) {
      next(err);
    }
  };
