import { getAccessToken } from "@/lib/auth";
import { ListingsResponseSchema } from "@/schemas/listings";
import type { ListingsResponse } from "@/types/listings";

export async function fetchListingsFavourite(): Promise<ListingsResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(
    `${process.env.API_BASE_URL}listings/favourites/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch favourites");
  }

  const json = await response.json();
  return ListingsResponseSchema.parse(json);
}
