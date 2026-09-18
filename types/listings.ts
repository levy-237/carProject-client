import type { ApiResponse } from "@/types/api";

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

export type IdName = {
  id: number;
  name: string;
};

export type Owner = {
  id: number;
  username: string;
  // province_detail: TODO
};

export type ModelTrimDetail = {
  id: number;
  name: string;
  connected_model: number;
  connected_model_name: string;
  battery_size: number | null;
  factory_range: number | null;
  max_ac_charge_kw: number;
  max_dc_charge_kw: number;
  twenty_to_eighty_charge_min: number;
  drivetrain: number | null;
  drivetrain_detail?: IdName | null;
};

export type ListingImage = {
  id: number;
  local_url: string;
  image: string;
  storage_key: string;
  created_at: string;
  is_cover: boolean;
};

export type Listing = {
  id: number;
  url: string;
  publish_date: string;
  owner: Owner;
  title: string;

  brand: number;
  brand_detail: IdName;

  model: number;
  model_detail: IdName;

  model_trim: number;
  model_trim_detail: ModelTrimDetail;

  makeyear: string;
  price: number;
  price_history: unknown[];

  body_type: number;
  body_type_detail: IdName;

  mileage: number;

  condition: number;
  condition_detail: IdName;

  power: number;
  battery_health: number | null;

  real_summer_range: number | null;
  real_winter_range: number | null;

  heat_pump: boolean;
  garantie: boolean;
  pickerl: boolean;

  description: string;
  view_count: number;
  is_online: boolean;
  is_premium: boolean;
  is_sold: boolean;
  is_under_review: boolean;
  is_reserved: boolean;

  images: ListingImage[];
  favourite_count: number;
  cover_image: ListingImage | null;
};

export type ListingsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
};

export type ListingIdPayload = {
  listingId: number;
};

export type ListingListResponse = ApiResponse<ListingsResponse>;

export type ListingDetailResponse = ApiResponse<Listing>;

export type ListingArrayResponse = ApiResponse<Listing[]>;

export type MutateListingResponse = ApiResponse<ListingIdPayload>;

export type ToggleFavouriteResponse = ApiResponse<null>;
