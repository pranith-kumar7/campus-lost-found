import express from "express";
import { protect, admin } from "../middleware/auth.js";
import {
  addClaimMessage,
  getClaimMessages,
  getClaimsByUser,
  getPendingClaims,
  markClaimAsRead,
  verifyClaim,
} from "../controllers/claimController.js";

const router = express.Router();

router.get("/pending", protect, admin, getPendingClaims);
router.get("/my-claims", protect, getClaimsByUser);
router.get("/:claimId/messages", protect, getClaimMessages);
router.post("/:claimId/messages", protect, addClaimMessage);
router.put("/:claimId/read", protect, markClaimAsRead);
router.put("/:claimId/verify", protect, admin, verifyClaim);

export default router;
