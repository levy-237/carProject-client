"use client";

import useFilterOptions from "@/hooks/useFilterOptions";

type SingleSelectFilterProps = {
  apiName: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
};

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50";

export default function SingleSelectFilter({
  apiName,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "Bitte wählen",
}: SingleSelectFilterProps) {
  const { data = [], isLoading, isError } = useFilterOptions({
    apiName,
    search: "",
    enabled: !disabled,
  });
  const options = disabled || isError ? [] : data;
  const error =
    !disabled && isError ? "Optionen konnten nicht geladen werden" : null;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
      {label}
      <select
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue ? Number(nextValue) : null);
        }}
        disabled={disabled || isLoading}
        className={selectClass}
      >
        <option value="">
          {isLoading ? "Laden..." : (error ?? placeholder)}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-normal text-red-600">{error}</span>
      )}
    </label>
  );
}
