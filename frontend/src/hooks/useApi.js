// useApi.js — Generic async API call hook
import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/errorMessages.js";
import toast from "react-hot-toast";

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (
      apiCall,
      {
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showSuccessToast = false,
        showErrorToast = true,
      } = {},
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return { success: true, data: result };
      } catch (err) {
        const message = errorMessage || getErrorMessage(err);
        setError(message);

        if (showErrorToast) {
          toast.error(message);
        }

        onError?.(err);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { isLoading, error, data, execute, reset };
}
