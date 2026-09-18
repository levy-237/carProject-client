import type { ApiResponse } from "@/types/api";
import type { z } from "zod";
import type {
  IdNameSchema,
  OwnerSchema,
  ModelTrimDetailSchema,
  ListingImageSchema,
  ListingSchema,
  ListingsResponseSchema,
} from "@/schemas/listings";

export { type AddListingFormValues } from "@/schemas/listings";

export type ListingItem = {
  id: number;
  title: string;
  price: string;
  year: number;
  mileage: string;
  location: string;
  drivetrain: string;
  image: string;
  link: string;
};

export type IdName = z.infer<typeof IdNameSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type ModelTrimDetail = z.infer<typeof ModelTrimDetailSchema>;
export type ListingImage = z.infer<typeof ListingImageSchema>;
export type Listing = z.infer<typeof ListingSchema>;
export type ListingsResponse = z.infer<typeof ListingsResponseSchema>;

export type ListingIdPayload = {
  listingId: number;
};

export type ListingListResponse = ApiResponse<ListingsResponse>;

export type ListingDetailResponse = ApiResponse<Listing>;

export type ListingArrayResponse = ApiResponse<Listing[]>;

export type MutateListingResponse = ApiResponse<ListingIdPayload>;

export type ToggleFavouriteResponse = ApiResponse<null>;
