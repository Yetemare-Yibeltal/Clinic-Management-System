// useModal.js — Modal state management hook
import { useState, useCallback } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const open = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data so closing animation completes
    setTimeout(() => setModalData(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle,
  };
}
