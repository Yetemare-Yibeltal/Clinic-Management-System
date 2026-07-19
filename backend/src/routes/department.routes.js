// department.routes.js — Maps /api/departments/* URLs to controller
import { Router } from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignDoctorToDepartment,
} from "../controllers/department.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateDepartment,
  validateUpdateDepartment,
} from "../middleware/department.validator.js";

const router = Router();

// Anyone logged in can view departments
router.get("/", protect, getDepartments);
router.get("/:id", protect, getDepartmentById);

// Admin only
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateCreateDepartment,
  validate,
  createDepartment,
);

router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  validateUpdateDepartment,
  validate,
  updateDepartment,
);

router.delete("/:id", protect, restrictTo("admin"), deleteDepartment);

router.patch(
  "/:id/assign-doctor",
  protect,
  restrictTo("admin"),
  assignDoctorToDepartment,
);

export default router;
