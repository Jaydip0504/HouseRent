import express from "express";
import {
  getAllUsers,
  grantOwnerPermission,
  getAllPropertiesAdmin,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, getAllUsers);
router.put("/users/:id/grant-owner", protect, grantOwnerPermission);
router.get("/properties", protect, getAllPropertiesAdmin);
router.get("/bookings", protect, getAllBookings);
router.put("/bookings/:id/status", protect, updateBookingStatus);

export default router;