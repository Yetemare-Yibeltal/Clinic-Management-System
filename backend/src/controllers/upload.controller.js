// upload.controller.js — Saves uploaded file path to the logged-in user's profile
import User from "../models/User.model.js";

// POST /api/upload/avatar
export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true },
    );

    res.json({
      message: "Profile photo updated successfully.",
      avatar: user.avatar,
    });
  } catch (err) {
    next(err);
  }
}
