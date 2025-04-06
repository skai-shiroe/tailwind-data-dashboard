import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
}

export function Pagination({ page, totalPages, onPageChange, siblings = 1 }: PaginationProps) {
  const paginationRange = useMemo(() => {
    // Calculate range of visible page numbers
    const totalPageNumbers = siblings * 2 + 3; // siblings + current + first + last + 2 dots

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblings, 1);
    const rightSiblingIndex = Math.min(page + siblings, totalPages);

    // Don't show dots when there's only one page number to be inserted between the extremes
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblings;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, -1, totalPages];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblings;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);

      return [1, -1, ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);

    return [1, -1, ...middleRange, -2, totalPages];
  }, [page, siblings, totalPages]);

  return (
    <nav aria-label="Pagination" className="mx-auto flex w-full justify-center">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Aller à la page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>

        {paginationRange.map((pageNumber, i) => {
          if (pageNumber === -1 || pageNumber === -2) {
            return (
              <li key={`ellipsis-${i}`}>
                <Button variant="ghost" size="icon" disabled>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </li>
            );
          }

          return (
            <li key={`page-${pageNumber}`}>
              <Button
                variant={page === pageNumber ? "default" : "outline"}
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Aller à la page ${pageNumber}`}
                aria-current={page === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}

        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Aller à la page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
