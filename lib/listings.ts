import type { DetailSearchFormState } from "@/lib/detail-search";
import { ListingSchema, ListingsResponseSchema } from "@/schemas/listings";
import type { Listing, ListingsResponse } from "@/types/listings";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatYear(makeyear: string): number {
  return new Date(makeyear).getFullYear();
}

export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString("de-DE")} km`;
}

export async function fetchListings({
  filters,
}: {
  filters: DetailSearchFormState;
}): Promise<ListingsResponse> {
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string" && value) {
      url.set(key, value.toString().trim());
    } else if (Array.isArray(value) && value.length > 0) {
      for (const item of value) {
        url.append(key, item.toString().trim());
      }
    }
  }

  const queryString = url.toString();

  const fetchurl = queryString
    ? `${API_BASE_URL}listings/?${queryString}`
    : `${API_BASE_URL}listings/`;

  console.log(fetchurl);

  const response = await fetch(fetchurl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  const jsonres = await response.json();

  const data = ListingsResponseSchema.parse(jsonres);

  return data;
}

export async function fetchListingDetail(id: number): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}listings/${id}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching listing (${response.status})`);
  }

  return ListingSchema.parse(await response.json());
}

export async function fetchTopDeals(): Promise<ListingsResponse> {
  const fetchurl = `${API_BASE_URL}listings/most-viewed/`;

  console.log(fetchurl);

  const response = await fetch(fetchurl, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Error fetching top deals");
  }

  const jsonres = await response.json();

  const data = ListingsResponseSchema.parse(jsonres);

  return data;
}
