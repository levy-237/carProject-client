import { getAccessToken } from "@/lib/auth";
import { ListingSchema, ListingsResponseSchema } from "@/schemas/listings";
import type {
  AddListingFormValues,
  Listing,
  ListingsResponse,
} from "@/types/listings";

export async function fetchMyListings(): Promise<ListingsResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${process.env.API_BASE_URL}listings/my/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my listings");
  }

  const json = await response.json();
  const data = ListingsResponseSchema.parse(json);

  return data;
}
export async function fetchMyListingsById(
  id: number,
): Promise<Listing> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(
    `${process.env.API_BASE_URL}listings/my/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch my listing");
  }

  const json = await response.json();
  return ListingSchema.parse(json);
}

export function myListingFetchToEditForm(
  listing: Listing,
): AddListingFormValues {
  return {
    title: listing.title,
    description: listing.description,
    brand: listing.brand,
    model: listing.model,
    model_trim: listing.model_trim,
    makeyear: listing.makeyear.slice(0, 10),
    price: listing.price,
    body_type: listing.body_type,
    mileage: listing.mileage,
    condition: listing.condition,
    power: listing.power,
    battery_health: listing.battery_health ?? undefined,
    real_summer_range: listing.real_summer_range ?? undefined,
    real_winter_range: listing.real_winter_range ?? undefined,
    heat_pump: listing.heat_pump,
    garantie: listing.garantie,
    pickerl: listing.pickerl,
    is_sold: listing.is_sold,
    is_reserved: listing.is_reserved,
  };
}
