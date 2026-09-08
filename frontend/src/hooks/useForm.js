// useForm.js — Generic form state management hook
import { useState, useCallback } from "react";

export function useForm(initialValues = {}, validateFn = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handle field change ────────────────────────────
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  // ── Handle field blur (mark as touched) ───────────
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur if validator exists
      if (validateFn) {
        const validationErrors = validateFn(values);
        if (validationErrors[name]) {
          setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
        }
      }
    },
    [values, validateFn],
  );

  // ── Set a specific field value ─────────────────────
  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  // ── Set multiple values at once ────────────────────
  const setMultipleValues = useCallback((newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // ── Set a specific error ───────────────────────────
  const setError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  // ── Set multiple errors ────────────────────────────
  const setMultipleErrors = useCallback((newErrors) => {
    setErrors((prev) => ({ ...prev, ...newErrors }));
  }, []);

  // ── Validate all fields ────────────────────────────
  const validate = useCallback(() => {
    if (!validateFn) return true;

    const validationErrors = validateFn(values);
    setErrors(validationErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  // ── Handle form submission ─────────────────────────
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e?.preventDefault();

      const isValid = validate();
      if (!isValid) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate],
  );

  // ── Reset form ─────────────────────────────────────
  const reset = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues],
  );

  // ── Check if field has error and is touched ────────
  const hasError = useCallback(
    (name) => {
      return touched[name] && !!errors[name];
    },
    [touched, errors],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setValue,
    setMultipleValues,
    setError,
    setMultipleErrors,
    validate,
    handleSubmit,
    reset,
    hasError,
    isValid: Object.keys(errors).length === 0,
  };
}
