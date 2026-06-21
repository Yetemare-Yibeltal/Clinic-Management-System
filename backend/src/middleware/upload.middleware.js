// upload.middleware.js — Wraps multer with clean error handling
import multer from "multer";
import { upload } from "../config/multer.js";

// Wraps a single-file multer upload and converts its errors
// into the same JSON error format as the rest of the API.
export function uploadSingle(fieldName) {
  return (req, res, next) => {
    const handler = upload.single(fieldName);

    handler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File is too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ error: err.message });
      }

      if (err) {
        return res.status(400).json({ error: err.message });
      }

      next();
    });
  };
}
