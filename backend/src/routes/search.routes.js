// search.routes.js — Maps /api/search/* URLs to controller
import { Router } from "express";
import {
  globalSearch,
  searchDoctors,
} from "../controllers/search.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, globalSearch);
router.get("/doctors", protect, searchDoctors);

export default router;
