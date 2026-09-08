// usePagination.js — Pagination state management hook
import { useState, useCallback } from "react";

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) setPage((p) => p + 1);
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  const firstPage = useCallback(() => setPage(1), []);

  const lastPage = useCallback(() => setPage(totalPages), [totalPages]);

  const setTotalItems = useCallback(
    (count) => {
      setTotal(count);
      // Reset to page 1 if current page is now out of range
      if (page > Math.ceil(count / limit)) {
        setPage(1);
      }
    },
    [page, limit],
  );

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setTotalItems,
    changeLimit,
    reset,
  };
}
