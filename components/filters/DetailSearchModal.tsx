"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useQueryStates } from "nuqs";
import DetailSearchForm from "./DetailSearchForm";
import ActiveFilterCountBadge from "./ActiveFilterCountBadge";
import { detailSearchParsers } from "@/lib/detail-search";
import { secondaryActiveFiltersCount } from "@/lib/activeFilter-count";

type DetailSearchModalProps = {
  count?: number;
};

export default function DetailSearchModal({ count }: DetailSearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters] = useQueryStates(detailSearchParsers);
  const displayCount = count ?? secondaryActiveFiltersCount(filters);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
        aria-label={
          displayCount > 0
            ? `Weitere Filter, ${displayCount} aktiv`
            : "Weitere Filter"
        }
      >
        <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
        <span>Weitere Filter</span>
        <ActiveFilterCountBadge count={displayCount} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
          onClick={() => setIsOpen(false)}
          role="presentation"
          data-testid="filterModal"
        >
          <div
            className="relative my-4 w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-search-title"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Filter schließen"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl">
              <Suspense
                fallback={
                  <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-lg">
                    Filter werden geladen...
                  </div>
                }
              >
                <DetailSearchForm onClose={() => setIsOpen(false)} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
