import { ListingSchema } from "@/schemas/listings";
import type { Listing } from "@/types/listings";

export async function fetchCompareListings(
  queryString: string,
): Promise<Listing[]> {
  const fetchurl = `${process.env.API_BASE_URL}listings/compare/?ids=${queryString}`;

  const response = await fetch(fetchurl, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comparison listings");
  }

  const json = await response.json();
  const data = ListingSchema.array().parse(json.results);
  return data;
}
