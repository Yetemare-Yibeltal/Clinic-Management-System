// searchService.js — Search API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const searchService = {
  // Global search across doctors patients and appointments
  async globalSearch(query, type = "all", limit = 5) {
    const params = buildQueryString({ q: query, type, limit });
    const response = await api.get(`${API.SEARCH.GLOBAL}${params}`);
    return response.data;
  },

  // Advanced doctor search with filters
  async searchDoctors(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.SEARCH.DOCTORS}${query}`);
    return response.data;
  },
};
