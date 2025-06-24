
import React from 'react';
import { Button } from './Button';
import { ChevronLeftIcon } from './icons';

const ChevronRightIconRotated: React.FC<{className?: string}> = ({className}) => <ChevronLeftIcon className={`${className} transform rotate-180`} />;


interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Logic to generate page numbers (e.g., 1 ... 4 5 6 ... 10)
  // This is a simplified version for now.
  const pageNumbers = [];
  const maxPagesToShow = 5; // Max page buttons to show including ellipsis
  const halfMax = Math.floor(maxPagesToShow / 2);

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    let startPage = Math.max(2, currentPage - halfMax + (currentPage + halfMax > totalPages ? (totalPages - currentPage - halfMax +1) : 0) );
    let endPage = Math.min(totalPages - 1, currentPage + halfMax - (currentPage - halfMax < 2 ? (2 - (currentPage - halfMax)) :0) );
    
    if (startPage > 2) {
      pageNumbers.push(-1); // Ellipsis placeholder
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }
    
    if (endPage < totalPages - 1) {
       pageNumbers.push(-1); // Ellipsis placeholder
    }
    // Always show last page
    pageNumbers.push(totalPages);
  }


  return (
    <nav aria-label="Pagination" className={`flex items-center justify-between ${className}`}>
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        variant="secondary"
        size="sm"
        leftIcon={<ChevronLeftIcon className="w-5 h-5" />}
      >
        Previous
      </Button>
      
      <div className="hidden sm:flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-sm">...</span>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              className="min-w-[2.25rem]" // Ensure circle-like for single digits
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}
      </div>
       <div className="sm:hidden text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="secondary"
        size="sm"
        rightIcon={<ChevronRightIconRotated className="w-5 h-5" />}
      >
        Next
      </Button>
    </nav>
  );
};
