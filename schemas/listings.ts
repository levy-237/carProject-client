import * as z from "zod";

export const IdNameSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const OwnerSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export const ModelTrimDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  connected_model: z.number(),
  connected_model_name: z.string(),
  battery_size: z.number().nullable(),
  factory_range: z.number().nullable(),
  max_ac_charge_kw: z.number().nullable(),
  max_dc_charge_kw: z.number().nullable(),
  twenty_to_eighty_charge_min: z.number().nullable(),
  drivetrain: z.number().nullable(),
  drivetrain_name: z.string().nullable().optional(),
  drivetrain_detail: IdNameSchema.nullable().optional(),
});

export const ListingImageSchema = z.object({
  id: z.number(),
  local_url: z.string().nullable(),
  image: z.string(),
  storage_key: z.string(),
  created_at: z.string(),
  is_cover: z.boolean(),
});

export const ListingSchema = z.object({
  id: z.number(),
  url: z.string().nullable(),
  publish_date: z.string(),
  owner: OwnerSchema,
  title: z.string(),
  brand: z.number(),
  brand_detail: IdNameSchema,
  model: z.number(),
  model_detail: IdNameSchema,
  model_trim: z.number().nullable(),
  model_trim_detail: ModelTrimDetailSchema.nullable(),
  makeyear: z.string(),
  price: z.number(),
  price_history: z.array(z.unknown()),
  body_type: z.number(),
  body_type_detail: IdNameSchema,
  mileage: z.number(),
  condition: z.number(),
  condition_detail: IdNameSchema,
  power: z.number(),
  battery_health: z.number().nullable(),
  real_summer_range: z.number().nullable(),
  real_winter_range: z.number().nullable(),
  heat_pump: z.boolean(),
  garantie: z.boolean(),
  pickerl: z.boolean(),
  description: z.string(),
  view_count: z.number(),
  is_online: z.boolean(),
  is_premium: z.boolean(),
  is_sold: z.boolean(),
  is_under_review: z.boolean(),
  is_reserved: z.boolean(),
  images: z.array(ListingImageSchema),
  favourite_count: z.number(),
  cover_image: ListingImageSchema.nullable().optional(),
});

export const ListingsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ListingSchema),
});

const requiredNumber = (message: string, min = 1) =>
  z.number({ error: message }).min(min, message);

export const AddListingSchema = z.object({
  title: z.string().min(1, "Bitte gib einen Titel ein."),
  description: z.string({ error: "Bitte gib eine Beschreibung ein." }),
  brand: z.number({ error: "Bitte wähle eine Marke aus." }),
  model: z.number({ error: "Bitte wähle ein Modell aus." }),
  model_trim: z.number({ error: "Bitte wähle einen Trim aus." }).nullable(),
  makeyear: z
    .string({ error: "Bitte wähle ein Baujahr aus." })
    .min(1, "Bitte wähle ein Baujahr aus."),
  price: requiredNumber("Bitte gib einen Preis ein."),
  body_type: z.number({ error: "Bitte wähle eine Karosserie aus." }),
  mileage: requiredNumber("Bitte gib den Kilometerstand ein.", 0),
  condition: z.number({ error: "Bitte wähle einen Zustand aus." }),
  power: requiredNumber("Bitte gib die Leistung ein."),
  battery_health: z
    .number({ error: "Bitte gib den Batteriezustand ein." })
    .min(0)
    .max(100)
    .optional(),
  real_summer_range: z
    .number({ error: "Bitte gib die Sommerreichweite ein." })
    .min(0)
    .optional(),
  real_winter_range: z
    .number({ error: "Bitte gib die Winterreichweite ein." })
    .min(0)
    .optional(),
  heat_pump: z.boolean(),
  garantie: z.boolean(),
  pickerl: z.boolean(),
  is_sold: z.boolean(),
  is_reserved: z.boolean(),
});

export type AddListingFormValues = z.infer<typeof AddListingSchema>;
