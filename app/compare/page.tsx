import ComparationView from "@/components/compare-listings/ComparationView";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";
import { createPageMetadata } from "@/lib/metadata";
import { fetchCompareListings } from "@/lib/compare-listings";

export const metadata = createPageMetadata("Vergleich");

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ compare: string }>;
}) {
  const { compare } = await searchParams;

  let listings;
  try {
    listings = await fetchCompareListings(compare);
  } catch (error) {
    console.error("Failed to load comparison listings:", error);
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        <ErrorCard
          title="Vergleich"
          message="Anzeigen konnten nicht geladen werden."
        />
      </main>
    );
  }

  return <ComparationView listings={listings} />;
}
