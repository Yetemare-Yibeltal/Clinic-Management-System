// schedule.validator.js — Validation rules for schedule related requests
import { body, param } from "express-validator";

// Validates the doctorId param is a valid MongoDB ObjectId
export const validateDoctorId = [
  param("doctorId").isMongoId().withMessage("Invalid doctor ID format"),
];

// Validates a full weekly grid object sent in PUT /api/schedules/:doctorId
export const validateWeeklyGrid = [
  param("doctorId").isMongoId().withMessage("Invalid doctor ID format"),

  body("weeklyGrid")
    .notEmpty()
    .withMessage("weeklyGrid is required")
    .isObject()
    .withMessage("weeklyGrid must be an object"),

  body("weeklyGrid.*")
    .isObject()
    .withMessage("Each day in weeklyGrid must be an object"),

  // Day index must be 0 (Sunday) through 6 (Saturday)
  body("weeklyGrid").custom((grid) => {
    const validDays = ["0", "1", "2", "3", "4", "5", "6"];
    const validSlots = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const validValues = ["avail", "booked", "break"];

    for (const day of Object.keys(grid)) {
      if (!validDays.includes(String(day))) {
        throw new Error(
          `Invalid day index "${day}". Must be 0 (Sunday) to 6 (Saturday)`,
        );
      }

      for (const [slot, value] of Object.entries(grid[day])) {
        if (!validSlots.includes(String(slot))) {
          throw new Error(`Invalid slot index "${slot}". Must be 0 to 9`);
        }
        if (!validValues.includes(value)) {
          throw new Error(
            `Invalid slot value "${value}" at day ${day}, slot ${slot}. Must be avail, booked, or break`,
          );
        }
      }
    }
    return true;
  }),
];

// Validates a single slot toggle sent in PATCH /api/schedules/:doctorId/slot
export const validateSlotUpdate = [
  param("doctorId").isMongoId().withMessage("Invalid doctor ID format"),

  body("day")
    .notEmpty()
    .withMessage("day is required")
    .isInt({ min: 0, max: 6 })
    .withMessage("day must be between 0 (Sunday) and 6 (Saturday)"),

  body("slot")
    .notEmpty()
    .withMessage("slot is required")
    .isInt({ min: 0, max: 9 })
    .withMessage("slot must be between 0 and 9"),

  body("type")
    .optional({ nullable: true })
    .isIn(["avail", "break"])
    .withMessage("type must be avail or break (or null to remove the slot)"),
];
