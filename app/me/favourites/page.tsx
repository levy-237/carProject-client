import FavouriteListingsView from "@/components/me/FavouriteListingsView";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";
import { createPageMetadata } from "@/lib/metadata";
import { fetchListingsFavourite } from "@/lib/listings-favourite";

export const metadata = createPageMetadata("Favoriten");

export default async function MeFavouritesPage() {
  let listings;
  try {
    listings = await fetchListingsFavourite();
  } catch (error) {
    console.error("Failed to load favourites:", error);
    return (
      <ErrorCard
        title="Favoriten"
        message="Favoriten konnten nicht geladen werden."
      />
    );
  }

  return (
    <FavouriteListingsView
      listings={listings.results}
      count={listings.count}
    />
  );
}
