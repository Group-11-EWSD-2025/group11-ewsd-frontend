import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  siblingsCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  variant?: "full" | "simple";
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  siblingsCount = 1,
  onPageChange,
  className = "",
  variant = "full",
}) => {
  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page, last page, current page, and siblings
    const pages: (number | "...")[] = [];

    // Calculate range
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    // Whether to show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Simple case: no dots needed
    if (!shouldShowLeftDots && !shouldShowRightDots) {
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      return pageNumbers;
    }

    // Show left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingsCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    // Show right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingsCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Show both dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return pages;
  };

  // Render the simple pagination variant (previously SimplePagination)
  if (variant === "simple") {
    return (
      <div className={`mt-4 flex items-center justify-between ${className}`}>
        <div className="text-sm text-gray-500">
          Showing {startItem} - {endItem} of {totalItems}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="h-10 w-[90px] border border-[#CBD5E1] bg-transparent"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-10 w-[90px] border border-[#CBD5E1] bg-transparent"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Only render full pagination if there's more than one page
  if (totalPages <= 1) {
    return (
      <div className={`mt-4 flex items-center justify-between ${className}`}>
        <div className="text-sm text-gray-500">
          Showing {totalItems > 0 ? 1 : 0} - {totalItems} of {totalItems}
        </div>
      </div>
    );
  }

  // Render the full pagination variant
  return (
    <div className={`mt-4 flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-500">
        Showing {startItem} - {endItem} of {totalItems}
      </div>

      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center">
          {generatePagination().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
