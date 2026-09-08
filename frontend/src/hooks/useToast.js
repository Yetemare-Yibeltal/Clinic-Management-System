// useToast.js — Toast notification hook
import toast from "react-hot-toast";

export function useToast() {
  const success = (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    toast(message, {
      icon: "ℹ️",
      duration: 4000,
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    toast(message, {
      icon: "⚠️",
      duration: 4000,
      style: {
        background: "rgba(15, 23, 42, 0.95)",
        color: "#fbbf24",
        border: "1px solid rgba(251,191,36,0.3)",
      },
      ...options,
    });
  };

  const loading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const promise = (
    promiseFn,
    { loading: loadingMsg, success: successMsg, error: errorMsg },
  ) => {
    return toast.promise(promiseFn, {
      loading: loadingMsg,
      success: successMsg,
      error: errorMsg,
    });
  };

  return { success, error, info, warning, loading, dismiss, promise };
}
