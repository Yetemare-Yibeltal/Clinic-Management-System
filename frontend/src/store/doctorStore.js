// doctorStore.js — Global doctor state using Zustand
import { create } from "zustand";
import { doctorService } from "../services/doctorService.js";
import { scheduleService } from "../services/scheduleService.js";
import { getErrorMessage } from "../utils/errorMessages.js";

const useDoctorStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  doctors: [],
  specializations: [],
  selectedDoctor: null,
  schedule: null,
  availableSlots: [],
  isLoading: false,
  isLoadingSlots: false,
  isLoadingSchedule: false,
  error: null,
  filters: {
    spec: "",
    q: "",
  },

  // ── Fetch all doctors ──────────────────────────────
  fetchDoctors: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().filters, ...params };
      const cleanParams = Object.fromEntries(
        Object.entries(mergedParams).filter(([, v]) => v && v !== "All"),
      );
      const data = await doctorService.getAllDoctors(cleanParams);
      set({ doctors: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      return [];
    }
  },

  // ── Fetch doctor by ID ─────────────────────────────
  fetchDoctorById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await doctorService.getDoctorById(id);
      set({ selectedDoctor: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      return null;
    }
  },

  // ── Fetch specializations ──────────────────────────
  fetchSpecializations: async () => {
    try {
      const data = await doctorService.getSpecializations();
      set({ specializations: ["All", ...data] });
    } catch {
      // Silently fail
    }
  },

  // ── Fetch doctor schedule ──────────────────────────
  fetchSchedule: async (doctorId) => {
    set({ isLoadingSchedule: true });
    try {
      const data = await scheduleService.getSchedule(doctorId);
      set({ schedule: data, isLoadingSchedule: false });
      return data;
    } catch (err) {
      set({ isLoadingSchedule: false, error: getErrorMessage(err) });
      return null;
    }
  },

  // ── Fetch available slots for a date ──────────────
  fetchAvailableSlots: async (doctorId, date) => {
    set({ isLoadingSlots: true, availableSlots: [] });
    try {
      const data = await scheduleService.getAvailableSlots(doctorId, date);
      set({ availableSlots: data.availableSlots || [], isLoadingSlots: false });
      return data.availableSlots || [];
    } catch (err) {
      set({ isLoadingSlots: false, availableSlots: [] });
      return [];
    }
  },

  // ── Save schedule ──────────────────────────────────
  saveSchedule: async (doctorId, weeklyGrid) => {
    try {
      const data = await scheduleService.saveSchedule(doctorId, weeklyGrid);
      set({ schedule: data });
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  // ── Update single slot ─────────────────────────────
  updateSlot: async (doctorId, day, slot, type) => {
    try {
      await scheduleService.updateSlot(doctorId, day, slot, type);
      await get().fetchSchedule(doctorId);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  // ── Set filters ────────────────────────────────────
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => set({ filters: { spec: "", q: "" } }),

  // ── Set selected doctor ────────────────────────────
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),

  // ── Clear error ────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useDoctorStore;
