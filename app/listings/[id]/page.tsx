import ListingDetailView from "@/components/listings/ListingDetailView";
import { getUserProfile } from "@/lib/auth";
import { createPageMetadata } from "@/lib/metadata";
import { fetchListingDetail } from "@/lib/listings";
import type { Metadata } from "next";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    return createPageMetadata("Anzeige");
  }

  try {
    const listing = await fetchListingDetail(listingId);
    return createPageMetadata(listing.title);
  } catch {
    return createPageMetadata("Anzeige");
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    throw new Error("Invalid listing ID");
  }

  const [listing, userResponse] = await Promise.all([
    fetchListingDetail(listingId),
    getUserProfile(),
  ]);

  const user = userResponse.success ? userResponse.data : null;
  const isFavourite =
    user?.favourite_listings.includes(listing.id) ?? false;

  return (
    <ListingDetailView
      listing={listing}
      isFavourite={isFavourite}
    />
  );
}
