"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type ApiFilterItem = {
  id: string;
  name: string;
};

export default function useFilterOptions({
  apiName,
  search,
  enabled,
}: {
  apiName: string;
  search: string;
  enabled: boolean;
}) {
  const searchTerm = search.trim();

  return useQuery({
    queryKey: ["filter-options", apiName, searchTerm],
    enabled: enabled && searchTerm.length !== 1,
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async ({ signal }): Promise<ApiFilterItem[]> => {
      const separator = apiName.includes("?") ? "&" : "?";
      const query = searchTerm
        ? `${separator}name=${encodeURIComponent(searchTerm)}`
        : "";
      const response = await fetch(`${API_BASE_URL}${apiName}${query}`, {
        signal,
      });

      if (!response.ok) throw new Error("Could not load options");

      const data = await response.json();
      return data.results.map((item: ApiFilterItem) => ({
        ...item,
        id: String(item.id),
      }));
    },
  });
}
