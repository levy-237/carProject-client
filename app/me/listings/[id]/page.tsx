import {
  fetchMyListingsById,
  myListingFetchToEditForm,
} from "@/lib/listings-my";
import ListingForm from "@/components/add-listings/ListingForm";
import ErrorCard from "@/components/skeletons&&errors/ErrorCard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Anzeige bearbeiten");

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let listing;
  try {
    listing = await fetchMyListingsById(parseInt(id));
  } catch (error) {
    console.error("Failed to load listing for editing:", error);
    return (
      <ErrorCard
        title="Anzeige bearbeiten"
        message="Anzeige konnte nicht geladen werden."
      />
    );
  }

  return (
    <ListingForm
      listing={myListingFetchToEditForm(listing)}
      variant="edit"
      id={parseInt(id)}
    />
  );
}
