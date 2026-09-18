"use client";

import {
  createListing,
  updateListing,
} from "@/actions/listingActions";
import BooleanSelect from "@/components/filters/BooleanSelect";
import FilterSection from "@/components/filters/FilterSection";
import SingleSelectFilter from "@/components/filters/SingleSelectFilter";
import type { BooleanFilterValue } from "@/lib/detail-search";
import FieldError from "./FieldError";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import { AddListingSchema } from "@/schemas/listings";
import type { AddListingFormValues } from "@/types/listings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Controller,
  useWatch,
  useForm,
  type SubmitHandler,
} from "react-hook-form";

function toBooleanSelectValue(value: boolean | undefined): BooleanFilterValue {
  if (value === true) return "true";
  if (value === false) return "false";
  return "false";
}

export default function ListingForm({
  listing,
  variant,
  id,
}: {
  listing?: AddListingFormValues;
  variant: "create" | "edit";
  id?: number;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    resetField,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddListingFormValues>({
    resolver: zodResolver(AddListingSchema),
    defaultValues: listing || {
      model_trim: null,
      heat_pump: false,
      garantie: false,
      pickerl: false,
      is_sold: false,
      is_reserved: false,
    },
  });

  const onSubmit: SubmitHandler<AddListingFormValues> = async (data) => {
    const result =
      variant === "edit" && id
        ? await updateListing({ id, data })
        : await createListing(data);

    if (!result.success) {
      setError("root", { message: result.message });
      return;
    }

    router.push("/me/listings");
  };

  const brand = useWatch({ control, name: "brand" });
  const modelApiName = brand ? `cars/models?relation=${brand}` : "cars/models";

  const model = useWatch({ control, name: "model" });
  const trimApiName = model ? `cars/trims?relation=${model}` : "cars/trims";

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-lg md:p-10"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Anzeige erstellen
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gib die Details deines Fahrzeugs ein.
        </p>
      </div>

      {errors.root && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {errors.root.message}
        </p>
      )}

      <FilterSection title="Allgemein">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Titel"
            name="title"
            register={register}
            error={errors.title?.message}
            placeholder="z. B. 2020 Tesla Model 3 Long Range"
          />
          <FormTextarea
            label="Beschreibung"
            name="description"
            register={register}
            error={errors.description?.message}
            placeholder="Beschreibe dein Fahrzeug..."
          />
        </div>
      </FilterSection>

      <FilterSection title="Fahrzeug">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Controller
            name="brand"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <SingleSelectFilter
                  apiName="cars/brands"
                  label="Marke"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    resetField("model");
                    resetField("model_trim");
                  }}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            key={brand ?? "no-brand"}
            name="model"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <SingleSelectFilter
                  apiName={modelApiName}
                  label="Modell"
                  value={field.value}
                  disabled={!brand}
                  onChange={(value) => {
                    field.onChange(value);
                    resetField("model_trim");
                  }}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            key={model ?? "no-model"}
            name="model_trim"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <SingleSelectFilter
                  apiName={trimApiName}
                  label="Trim"
                  value={field.value}
                  disabled={!model}
                  onChange={field.onChange}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            name="body_type"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <SingleSelectFilter
                  apiName="cars/body-types"
                  label="Karosserie"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            name="condition"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <SingleSelectFilter
                  apiName="cars/conditions"
                  label="Zustand"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <FormInput
            label="Baujahr"
            name="makeyear"
            type="date"
            register={register}
            error={errors.makeyear?.message}
          />
        </div>
      </FilterSection>

      <FilterSection title="Preis & Kilometerstand">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            label="Preis (€)"
            name="price"
            type="number"
            register={register}
            error={errors.price?.message}
            placeholder="25000"
          />
          <FormInput
            label="Kilometerstand"
            name="mileage"
            type="number"
            register={register}
            error={errors.mileage?.message}
            placeholder="10000"
          />
          <FormInput
            label="Leistung (PS)"
            name="power"
            type="number"
            register={register}
            error={errors.power?.message}
            placeholder="150"
          />
        </div>
      </FilterSection>

      <FilterSection title="Batterie & Reichweite">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            label="Batteriezustand (%)"
            name="battery_health"
            type="number"
            register={register}
            error={errors.battery_health?.message}
            placeholder="92"
          />
          <FormInput
            label="Sommerreichweite (km)"
            name="real_summer_range"
            type="number"
            register={register}
            error={errors.real_summer_range?.message}
            placeholder="450"
          />
          <FormInput
            label="Winterreichweite (km)"
            name="real_winter_range"
            type="number"
            register={register}
            error={errors.real_winter_range?.message}
            placeholder="320"
          />
        </div>
      </FilterSection>

      <FilterSection title="Ausstattung & Status">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Controller
            name="heat_pump"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <BooleanSelect
                  label="Wärmepumpe"
                  value={toBooleanSelectValue(field.value)}
                  onChange={(value) => field.onChange(value === "true")}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            name="garantie"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <BooleanSelect
                  label="Garantie"
                  value={toBooleanSelectValue(field.value)}
                  onChange={(value) => field.onChange(value === "true")}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <Controller
            name="pickerl"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <BooleanSelect
                  label="Pickerl"
                  value={toBooleanSelectValue(field.value)}
                  onChange={(value) => field.onChange(value === "true")}
                />
                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />

          {variant === "edit" && (
            <>
              <Controller
                name="is_sold"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <BooleanSelect
                      label="Verkauft"
                      value={toBooleanSelectValue(field.value)}
                      onChange={(value) => field.onChange(value === "true")}
                    />
                    <FieldError message={fieldState.error?.message} />
                  </div>
                )}
              />
              <Controller
                name="is_reserved"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <BooleanSelect
                      label="Reserviert"
                      value={toBooleanSelectValue(field.value)}
                      onChange={(value) => field.onChange(value === "true")}
                    />
                    <FieldError message={fieldState.error?.message} />
                  </div>
                )}
              />
            </>
          )}
        </div>
      </FilterSection>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-60"
      >
        {isSubmitting ? "Wird veröffentlicht..." : "Anzeige veröffentlichen"}
      </button>
    </form>
  );
}
