// appointmentStore.js — Global appointment state using Zustand
import { create } from "zustand";
import { appointmentService } from "../services/appointmentService.js";
import { getErrorMessage } from "../utils/errorMessages.js";

const useAppointmentStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  filters: {
    status: "all",
    date: "",
    doctorId: "",
    q: "",
  },

  // ── Fetch appointments ─────────────────────────────
  fetchAppointments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().filters, ...params };
      // Remove 'all' values so API doesn't filter by them
      const cleanParams = Object.fromEntries(
        Object.entries(mergedParams).filter(([, v]) => v && v !== "all"),
      );
      const data = await appointmentService.getAppointments(cleanParams);
      set({ appointments: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      return [];
    }
  },

  // ── Fetch single appointment ───────────────────────
  fetchAppointmentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await appointmentService.getAppointmentById(id);
      set({ selectedAppointment: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      return null;
    }
  },

  // ── Book appointment ───────────────────────────────
  createAppointment: async (data) => {
    set({ isCreating: true, error: null });
    try {
      const appointment = await appointmentService.createAppointment(data);
      set((state) => ({
        appointments: [appointment, ...state.appointments],
        isCreating: false,
      }));
      return { success: true, appointment };
    } catch (err) {
      const error = getErrorMessage(err);
      set({ isCreating: false, error });
      return { success: false, error };
    }
  },

  // ── Update appointment status ──────────────────────
  updateStatus: async (id, data) => {
    set({ isUpdating: true, error: null });
    try {
      const updated = await appointmentService.updateStatus(id, data);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a._id === id ? updated : a,
        ),
        selectedAppointment:
          state.selectedAppointment?._id === id
            ? updated
            : state.selectedAppointment,
        isUpdating: false,
      }));
      return { success: true, appointment: updated };
    } catch (err) {
      const error = getErrorMessage(err);
      set({ isUpdating: false, error });
      return { success: false, error };
    }
  },

  // ── Cancel appointment ─────────────────────────────
  cancelAppointment: async (id, note = "") => {
    return get().updateStatus(id, {
      status: "cancelled",
      cancellationNote: note,
    });
  },

  // ── Confirm appointment ────────────────────────────
  confirmAppointment: async (id) => {
    return get().updateStatus(id, { status: "confirmed" });
  },

  // ── Complete appointment ───────────────────────────
  completeAppointment: async (id, notes = "") => {
    return get().updateStatus(id, { status: "completed", notes });
  },

  // ── Bulk update ────────────────────────────────────
  bulkUpdateStatus: async (ids, status) => {
    set({ isUpdating: true, error: null });
    try {
      const result = await appointmentService.bulkUpdateStatus(ids, status);
      await get().fetchAppointments();
      set({ isUpdating: false });
      return { success: true, ...result };
    } catch (err) {
      const error = getErrorMessage(err);
      set({ isUpdating: false, error });
      return { success: false, error };
    }
  },

  // ── Set filters ────────────────────────────────────
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters: () => {
    set({ filters: { status: "all", date: "", doctorId: "", q: "" } });
  },

  // ── Set selected appointment ───────────────────────
  setSelectedAppointment: (appointment) => {
    set({ selectedAppointment: appointment });
  },

  // ── Clear error ────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useAppointmentStore;
