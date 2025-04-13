import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";
import { StyledSelect } from "./StyledSelect";

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
  onPageSizeChange,
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
      <div
        className={`mt-4 flex flex-col items-center justify-between sm:flex-row ${className}`}
      >
        <div className="mb-4 flex items-center gap-2 text-gray-500 sm:mb-0">
          Showing {startItem} - {endItem} of {totalItems}
          {onPageSizeChange && (
            <>
              <span className="mx-2 inline-block h-4 w-px bg-gray-500"></span>
              <div className="flex items-center gap-2">
                <p>Per page:</p>
                <StyledSelect
                  className="w-[75px]"
                  value={pageSize}
                  onChange={(value) => onPageSizeChange(Number(value))}
                  options={[2, 4, 8, 12, 20].map((size) => ({
                    label: size,
                    value: size,
                  }))}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-border-weak h-10 min-w-[90px] border bg-transparent text-base"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            <p className="text-sm">Previous</p>
          </Button>
          <Button
            variant="outline"
            className="border-border-weak h-10 min-w-[90px] border bg-transparent text-base"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <p className="text-sm">Next</p>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // Only render full pagination if there's more than one page
  if (totalPages <= 1) {
    return (
      <div className={`mt-4 flex items-center justify-between ${className}`}>
        <div className="text-gray-500">
          Showing {totalItems > 0 ? 1 : 0} - {totalItems} of {totalItems}
          {onPageSizeChange && (
            <>
              <span className="mx-2 inline-block h-4 w-px bg-gray-500"></span>
              <span className="flex items-center">
                <span className="mr-2">Per page:</span>
                <StyledSelect
                  className="h-8 w-[80px]"
                  value={pageSize}
                  onChange={(value) => onPageSizeChange(Number(value))}
                  options={[4, 8, 12, 20].map((size) => ({
                    label: size,
                    value: size,
                  }))}
                />
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render the full pagination variant
  return (
    <div
      className={`mt-4 flex flex-col items-center justify-between sm:flex-row ${className}`}
    >
      <div className="mb-4 text-gray-500 sm:mb-0">
        Showing {startItem} - {endItem} of {totalItems}
        {onPageSizeChange && (
          <>
            <span className="mx-2 inline-block h-4 w-px bg-gray-500"></span>
            <span className="flex items-center">
              <span className="mr-2">Per page:</span>
              <StyledSelect
                className="h-8 w-[80px]"
                value={pageSize}
                onChange={(value) => onPageSizeChange(Number(value))}
                options={[4, 8, 12, 20].map((size) => ({
                  label: size,
                  value: size,
                }))}
              />
            </span>
          </>
        )}
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
