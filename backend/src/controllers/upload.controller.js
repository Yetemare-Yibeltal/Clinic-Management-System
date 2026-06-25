// upload.routes.js — Maps /api/upload/* URLs to controller functions
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { uploadAvatar } from "../controllers/upload.controller.js";

const router = Router();

router.post("/avatar", protect, uploadSingle("avatar"), uploadAvatar);

export default router;
