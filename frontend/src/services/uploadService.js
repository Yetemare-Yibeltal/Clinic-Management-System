// uploadService.js — File upload API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";

export const uploadService = {
  // Upload user avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post(API.UPLOAD.AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Upload with progress tracking
  async uploadAvatarWithProgress(file, onProgress) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post(API.UPLOAD.AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress?.(percent);
      },
    });
    return response.data;
  },
};
