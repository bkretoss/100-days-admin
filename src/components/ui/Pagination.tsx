import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
    <span className="text-xs text-gray-500 font-medium">
      Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages || 1}</b>
    </span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "size-8 rounded-lg text-xs font-bold transition-all",
              currentPage === i + 1
                ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/20"
                : "text-gray-500 hover:text-white hover:bg-white/5",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default Pagination;
