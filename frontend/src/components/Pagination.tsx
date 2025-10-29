import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  const { currentPage, totalPages } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        aria-label="Previous page"
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <IoChevronBack className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Go to page ${page}`}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <button
        aria-label="Next page"
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <IoChevronForward className="w-4 h-4" />
      </button>
    </div>
  );
}
