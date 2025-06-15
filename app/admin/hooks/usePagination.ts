import { useState, useMemo, useEffect } from 'react';

/**
 * Custom hook for handling pagination
 * @param data The array to paginate
 * @param pageSize Number of items per page
 * @returns Pagination controls and page data
 */
export function usePagination<T>(data: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(data.length / pageSize);
  
  const pagedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );
  
  // Reset to page 1 if data length changes and current page is out of bounds
  useEffect(() => {
    if (page > pageCount && page > 1) {
      setPage(1);
    }
  }, [data.length, pageCount, page]);
  
  return { page, setPage, pageCount, pagedData };
}