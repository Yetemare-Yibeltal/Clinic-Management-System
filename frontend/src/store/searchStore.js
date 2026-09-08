// searchStore.js — Global search state using Zustand
import { create } from "zustand";
import { searchService } from "../services/searchService.js";

const useSearchStore = create((set) => ({
  // ── State ──────────────────────────────────────────
  query: "",
  results: { doctors: [], patients: [], appointments: [] },
  isLoading: false,
  hasSearched: false,

  // ── Set search query ───────────────────────────────
  setQuery: (query) => set({ query }),

  // ── Global search ──────────────────────────────────
  search: async (query, type = "all") => {
    if (!query || query.trim().length < 2) {
      set({
        results: { doctors: [], patients: [], appointments: [] },
        hasSearched: false,
      });
      return;
    }

    set({ isLoading: true, hasSearched: false });
    try {
      const data = await searchService.globalSearch(query, type);
      set({
        results: data.results || {
          doctors: [],
          patients: [],
          appointments: [],
        },
        isLoading: false,
        hasSearched: true,
      });
    } catch {
      set({
        results: { doctors: [], patients: [], appointments: [] },
        isLoading: false,
        hasSearched: true,
      });
    }
  },

  // ── Clear search ───────────────────────────────────
  clearSearch: () => {
    set({
      query: "",
      results: { doctors: [], patients: [], appointments: [] },
      hasSearched: false,
      isLoading: false,
    });
  },
}));

export default useSearchStore;
