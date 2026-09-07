// reviewService.js — Review API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const reviewService = {
  // Patient submits a review
  async submitReview(data) {
    const response = await api.post(API.REVIEWS.CREATE, data);
    return response.data;
  },

  // Get patient's own reviews
  async getMyReviews() {
    const response = await api.get(API.REVIEWS.MY_REVIEWS);
    return response.data;
  },

  // Get reviews for a specific doctor
  async getDoctorReviews(doctorId, params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(
      `${API.REVIEWS.DOCTOR_REVIEWS(doctorId)}${query}`,
    );
    return response.data;
  },

  // Admin gets all reviews
  async getAllReviews(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.REVIEWS.LIST}${query}`);
    return response.data;
  },

  // Admin moderates a review
  async moderateReview(id, status, moderationNote = "") {
    const response = await api.patch(API.REVIEWS.MODERATE(id), {
      status,
      moderationNote,
    });
    return response.data;
  },

  // Doctor responds to a review
  async respondToReview(id, doctorResponse) {
    const response = await api.patch(API.REVIEWS.RESPOND(id), {
      doctorResponse,
    });
    return response.data;
  },
};
