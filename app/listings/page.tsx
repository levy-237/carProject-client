import ListingResults from "@/components/listings/ListingResults";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";
import ListingSidebar from "@/components/listings/ListingSidebar";
import { getUserProfile } from "@/lib/auth";
import { createPageMetadata } from "@/lib/metadata";
import { createLoader } from "nuqs/server";
import { detailSearchParsers } from "@/lib/detail-search";
import { fetchListings } from "@/lib/listings";
export const metadata = createPageMetadata("Fahrzeuge");

const loadFilters = createLoader(detailSearchParsers);

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const response = await getUserProfile();
  const user = response?.success ? response.data : null;

  const filters = await loadFilters(searchParams);

  let listings;
  try {
    listings = await fetchListings({ filters });
  } catch (error) {
    console.error("Failed to load listings:", error);
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 mt-5">
        <ErrorCard
          title="Fahrzeuge"
          message="Anzeigen konnten nicht geladen werden."
        />
      </main>
    );
  }

  return (
    <main className="flex w-full gap-6 px-4 py-10 flex-row items-start justify-center mt-5">
      <ListingSidebar />

      <ListingResults
        user={user}
        listings={listings}
        initialFilters={filters}
      />
    </main>
  );
}
