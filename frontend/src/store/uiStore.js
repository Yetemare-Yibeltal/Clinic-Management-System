// uiStore.js — Global UI state using Zustand
import { create } from "zustand";

const useUIStore = create((set, get) => ({
  // ── Sidebar ────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),

  // ── Modal ──────────────────────────────────────────
  activeModal: null,
  modalData: null,
  openModal: (modalName, data = null) =>
    set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // ── Global loading overlay ─────────────────────────
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  // ── Confirm dialog ─────────────────────────────────
  confirmDialog: {
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    type: "danger", // 'danger' | 'warning' | 'info'
  },

  openConfirm: ({ title, message, onConfirm, onCancel, type = "danger" }) => {
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        onConfirm,
        onCancel,
        type,
      },
    });
  },

  closeConfirm: () => {
    set({
      confirmDialog: {
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
        type: "danger",
      },
    });
  },

  // ── Active page title ──────────────────────────────
  pageTitle: "Dashboard",
  setPageTitle: (title) => set({ pageTitle: title }),

  // ── Mobile menu ────────────────────────────────────
  mobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  // ── Search overlay ─────────────────────────────────
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}));

export default useUIStore;
