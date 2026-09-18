import { fetchListings } from "@/lib/listings";
import { hashKey, useQuery } from "@tanstack/react-query";
import type { DetailSearchFormState } from "@/lib/detail-search";
import type { ListingsResponse } from "@/types/listings";

export default function useFetchListing({
  filters,
  listings,
  initialFilters,
}: {
  filters: DetailSearchFormState;
  listings: ListingsResponse;
  initialFilters: DetailSearchFormState;
}) {
  const queryKey = ["listings", filters];
  const initialQueryKey = ["listings", initialFilters];

  return useQuery({
    queryKey,
    staleTime: 60 * 1000,
    queryFn: () => fetchListings({ filters }),
    initialData:
      hashKey(queryKey) === hashKey(initialQueryKey) ? listings : undefined,
  });
}
