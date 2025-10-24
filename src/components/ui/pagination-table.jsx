"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  return {
    currentData,
    currentPage,
    totalPages,
    totalItems: data.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length),
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    firstPage: () => goToPage(1),
    lastPage: () => goToPage(totalPages),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function PaginationControls({ pagination }) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-card">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{pagination.startIndex}</span> to{' '}
        <span className="font-medium text-foreground">{pagination.endIndex}</span> of{' '}
        <span className="font-medium text-foreground">{pagination.totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={pagination.firstPage}
          disabled={!pagination.hasPrev}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={pagination.prevPage}
          disabled={!pagination.hasPrev}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1">Previous</span>
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground px-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={pagination.nextPage}
          disabled={!pagination.hasNext}
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={pagination.lastPage}
          disabled={!pagination.hasNext}
          className="hidden sm:flex"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
