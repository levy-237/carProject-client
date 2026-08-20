"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ActiveFilterCountBadge from "./ActiveFilterCountBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type ApiFilterItem = {
  id: string;
  name: string;
};

export type SelectedFilterIds = number[];

type DropDownFilterProps = {
  apiName: string;
  name: string;
  value: SelectedFilterIds;
  onChange: (selectedIds: SelectedFilterIds) => void;
  searchable?: boolean;
  disabled?: boolean;
};

export default function DropDownFilter({
  apiName,
  name,
  value,
  onChange,
  searchable = true,
  disabled = false,
}: DropDownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ApiFilterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (searchable && search && search.length < 2) return;

    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const query =
          searchable && search.trim()
            ? `?name=${encodeURIComponent(search.trim())}`
            : "";
        const url = `${API_BASE_URL}${apiName}${query}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch filter options");
        }

        const data = await response.json();
        const results: ApiFilterItem[] = data.results.map(
          (item: ApiFilterItem) => ({
            ...item,
            id: String(item.id),
          }),
        );
        setOptions(results);
      } catch {
        setError("Could not load options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [isOpen, apiName, search, searchable]);

  const handleToggleOpen = () => {
    if (disabled) return;

    setIsOpen((prev) => {
      if (prev) setSearch("");
      return !prev;
    });
  };

  const handleToggleOption = (option: ApiFilterItem) => {
    const optionId = Number(option.id);
    const isAlreadySelected = value.includes(optionId);

    const nextValue = isAlreadySelected
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];

    onChange(nextValue);
  };

  const selectedCount = value.length;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={handleToggleOpen}
        data-testid="drop-down-filter-button"
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          isOpen
            ? "border-gray-400 shadow-sm"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className="truncate text-left"
          data-testid="drop-down-filter-name"
        >
          {name}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          <ActiveFilterCountBadge count={selectedCount} />
          <ChevronDown
            className={`size-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div
          className="fadeIn absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          data-testid="drop-down-filter-dropdown"
        >
          {searchable && (
            <div
              className="border-b border-gray-100 p-3"
              data-testid="drop-down-filter-search"
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  data-testid="drop-down-filter-search-input"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${name.toLowerCase()}...`}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>
            </div>
          )}

          <ul className="max-h-56 overflow-y-auto p-2">
            {isLoading ? (
              <li
                className="px-3 py-6 text-center text-sm text-gray-400"
                data-testid="drop-down-filter-loading"
              >
                Loading...
              </li>
            ) : error ? (
              <li className="px-3 py-6 text-center text-sm text-red-500">
                {error}
              </li>
            ) : options.length > 0 ? (
              options.map((option) => {
                const isSelected = value.includes(Number(option.id));

                return (
                  <li key={option.id} data-testid="drop-down-filter-option">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOption(option)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                      />
                      <span className="text-sm text-gray-800">
                        {option.name}
                      </span>
                    </label>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-6 text-center text-sm text-gray-400">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
