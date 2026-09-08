// authStore.js — Global authentication state using Zustand
import { create } from "zustand";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../utils/errorMessages.js";

const useAuthStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  user: authService.getSavedUser(),
  token: authService.getToken(),
  isLoggedIn: authService.isLoggedIn(),
  isLoading: false,
  error: null,

  // ── Login ──────────────────────────────────────────
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      authService.saveAuth(data.token, data.user);
      set({
        user: data.user,
        token: data.token,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const error = getErrorMessage(err);
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  // ── Register ───────────────────────────────────────
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      authService.saveAuth(response.token, response.user);
      set({
        user: response.user,
        token: response.token,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
      return { success: true, user: response.user };
    } catch (err) {
      const error = getErrorMessage(err);
      set({ isLoading: false, error });
      return { success: false, error };
    }
  },

  // ── Logout ─────────────────────────────────────────
  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isLoggedIn: false,
      error: null,
    });
  },

  // ── Refresh current user ───────────────────────────
  refreshUser: async () => {
    try {
      const user = await authService.getMe();
      authService.saveAuth(get().token, user);
      set({ user });
      return user;
    } catch {
      get().logout();
    }
  },

  // ── Update user in store after profile edit ────────
  updateUser: (updatedUser) => {
    const merged = { ...get().user, ...updatedUser };
    authService.saveAuth(get().token, merged);
    set({ user: merged });
  },

  // ── Clear error ────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
