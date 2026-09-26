import express from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/owner-bookings", protect, getOwnerBookings);

export default router;