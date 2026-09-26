import express from "express";
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/all", protect, getProperties);
router.get("/my-properties", protect, getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, createProperty);

export default router;