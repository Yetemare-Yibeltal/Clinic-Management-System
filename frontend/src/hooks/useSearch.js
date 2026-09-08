// useSearch.js — Search hook with debounce
import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce.js";
import useSearchStore from "../store/searchStore.js";

export function useSearch(delay = 400) {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, delay);

  const {
    query,
    results,
    isLoading,
    hasSearched,
    search,
    clearSearch,
    setQuery,
  } = useSearchStore();

  // Trigger search when debounced value changes
  useEffect(() => {
    setQuery(debouncedValue);
    if (debouncedValue.trim().length >= 2) {
      search(debouncedValue);
    } else if (debouncedValue.trim().length === 0) {
      clearSearch();
    }
  }, [debouncedValue]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleClear = () => {
    setInputValue("");
    clearSearch();
  };

  return {
    inputValue,
    query,
    results,
    isLoading,
    hasSearched,
    handleInputChange,
    handleClear,
    totalResults:
      (results.doctors?.length || 0) +
      (results.patients?.length || 0) +
      (results.appointments?.length || 0),
  };
}
