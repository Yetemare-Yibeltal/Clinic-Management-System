// clinicStore.js — Global clinic settings state using Zustand
import { create } from "zustand";
import { clinicService } from "../services/clinicService.js";

const useClinicStore = create((set) => ({
  // ── State ──────────────────────────────────────────
  settings: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  // ── Fetch clinic settings ──────────────────────────
  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await clinicService.getSettings();
      set({ settings: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return null;
    }
  },

  // ── Update settings (admin) ────────────────────────
  updateSettings: async (data) => {
    set({ isUpdating: true, error: null });
    try {
      const updated = await clinicService.updateSettings(data);
      set({ settings: updated.settings, isUpdating: false });
      return { success: true };
    } catch (err) {
      set({ isUpdating: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // ── Update payment accounts (admin) ───────────────
  updatePaymentAccounts: async (data) => {
    set({ isUpdating: true, error: null });
    try {
      const updated = await clinicService.updatePaymentAccounts(data);
      set((state) => ({
        settings: {
          ...state.settings,
          paymentSettings: updated.paymentSettings,
        },
        isUpdating: false,
      }));
      return { success: true };
    } catch (err) {
      set({ isUpdating: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  // ── Clear error ────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useClinicStore;
