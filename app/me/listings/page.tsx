import MyListingsView from "@/components/me/MyListingsView";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";
import { createPageMetadata } from "@/lib/metadata";
import { fetchMyListings } from "@/lib/listings-my";

export const metadata = createPageMetadata("Meine Anzeigen");

export default async function MeListingsPage() {
  let listings;
  try {
    listings = await fetchMyListings();
  } catch {
    return (
      <ErrorCard
        title="Meine Anzeigen"
        message="Anzeigen konnten nicht geladen werden."
      />
    );
  }

  return <MyListingsView listings={listings.results} count={listings.count} />;
}
