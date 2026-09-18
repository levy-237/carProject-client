"use client";

import { useEffect, useState } from "react";
import DetailSearchModal from "@/components/filters/DetailSearchModal";
import { fetchListings } from "@/lib/listings";
import type {
  Listing,
  ListingListResponse,
  ListingsResponse,
} from "@/types/listings";
import ListingCard from "./ListingCard";
import ListingResultsEmpty from "./ListingResultsEmpty";
import Pagination from "./Pagination";
import ListingResultsSkeleton from "../skeletons&&errors/ListingResultsSkeleton";
import {
  parseAsArrayOf,
  parseAsInteger,
  useQueryState,
  useQueryStates,
} from "nuqs";
import {
  detailSearchParsers,
  type DetailSearchFormState,
} from "@/lib/detail-search";
import { useRouter } from "next/navigation";
import FiltersDelete from "../filters/FiltersDelete";
import type { UserProfile } from "@/types/users";
import ListingCompareButton from "./ListingCompareButton";
import { allActiveFiltersCount } from "@/lib/activeFilter-count";
import { showToast } from "@/lib/toast";
import useFetchListing from "@/hooks/useFetchListing";

export default function ListingResults({
  user,
  listings,
  initialFilters,
}: {
  user: UserProfile | null;
  listings: ListingsResponse;
  initialFilters: DetailSearchFormState;
}) {
  const router = useRouter();

  const [filters] = useQueryStates(detailSearchParsers);

  const [compareListings, setCompareListings] = useQueryState<number[]>(
    "compare",
    parseAsArrayOf(parseAsInteger),
  );

  const handleAddToCompare = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (compareListings && compareListings.includes(id)) {
      setCompareListings(
        compareListings.filter((listingId) => listingId !== id),
      );
    } else {
      if (compareListings && compareListings.length >= 3) {
        showToast("Du kannst maximal 3 Fahrzeuge vergleichen", "info");
        return;
      }
      setCompareListings([...(compareListings || []), id]);
    }
  };

  const isInCompare = (id: number) => compareListings?.includes(id) || false;

  const isComparationOn = compareListings && compareListings.length > 0;

  const filterCount = allActiveFiltersCount(filters);

  const { data, isError, isPending } = useFetchListing({
    filters,
    listings,
    initialFilters,
  });

  const removeComparison = () => {
    setCompareListings(null);
  };

  if (isPending) {
    return <ListingResultsSkeleton />;
  }

  // keep data if background fetch fails?
  if (isError && !data) {
    return (
      <section className="flex min-w-0 w-full max-w-4xl flex-1 flex-col gap-4">
        <p className="text-sm text-red-600">error</p>
      </section>
    );
  }

  const count = data.count;

  return (
    <section
      data-testid="listing-results"
      className="flex min-w-0 w-full max-w-4xl flex-1 flex-col gap-4"
    >
      {data.results.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">{count} Ergebnisse</p>
            <div className="flex items-center gap-4">
              <FiltersDelete onReset={() => router.push("/listings")} />
              <div className="lg:hidden">
                <DetailSearchModal count={filterCount} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {data.results.map((listing) => {
              const isFavourite =
                user?.favourite_listings?.includes(listing.id) || false;
              return (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavourite={isFavourite}
                  variant="default"
                  handleAddToCompare={handleAddToCompare}
                  isInCompare={isInCompare}
                />
              );
            })}
          </div>
          <Pagination count={count} />{" "}
          {isComparationOn && (
            <ListingCompareButton
              compareListings={compareListings}
              removeComparison={removeComparison}
            />
          )}
        </>
      ) : (
        <ListingResultsEmpty filters={filters} />
      )}
    </section>
  );
}
