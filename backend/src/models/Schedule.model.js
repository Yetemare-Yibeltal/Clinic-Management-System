// Schedule.model.js — Weekly availability grid for one doctor
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one schedule document per doctor
    },

    // weeklyGrid structure:
    // { "0": { "2": "avail", "5": "break" }, "1": { "0": "booked" }, ... }
    // outer key  = day index (0 = Sunday ... 6 = Saturday)
    // inner key  = time slot index (0–9)
    // inner value = "avail" | "booked" | "break"
    weeklyGrid: {
      type: Map,
      of: {
        type: Map,
        of: {
          type: String,
          enum: ["avail", "booked", "break"],
        },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Schedule", scheduleSchema);
