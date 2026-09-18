import FavoriteListingButton from "@/components/listings/FavoriteListingButton";
import { formatMileage, formatPrice, formatYear } from "@/lib/listings";
import type { Listing } from "@/types/listings";
import type { ReactNode } from "react";
import ListingStatusBadges from "./ListingStatusBadges";

function InfoPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
      {children}
    </span>
  );
}

function HighlightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function ListingDetailSummary({
  listing,
  isFavourite,
}: {
  listing: Listing;
  isFavourite: boolean;
}) {
  const year = formatYear(listing.makeyear);

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {listing.is_premium && (
            <span className="mb-3 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Premium-Anzeige
            </span>
          )}
          <h1 className="text-2xl font-semibold leading-tight text-gray-900 md:text-3xl">
            {listing.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {listing.brand_detail.name}
            <span className="mx-1.5 text-gray-300">·</span>
            {listing.model_detail.name}
            <span className="mx-1.5 text-gray-300">·</span>
            {listing.model_trim_detail?.name ?? "—"}
          </p>
        </div>

        <FavoriteListingButton
          isFavourite={isFavourite}
          listingId={listing.id}
        />
      </div>

      <div className="mt-5">
        <ListingStatusBadges listing={listing} />
      </div>

      <p className="mt-7 text-4xl font-bold tracking-tight text-gray-900">
        {formatPrice(listing.price)}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <HighlightStat label="Baujahr" value={String(year)} />
        <HighlightStat
          label="Kilometer"
          value={formatMileage(listing.mileage)}
        />
        <HighlightStat label="Leistung" value={`${listing.power} PS`} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {listing.real_summer_range && (
          <InfoPill>Sommer {listing.real_summer_range} km</InfoPill>
        )}
        {listing.real_winter_range && (
          <InfoPill>Winter {listing.real_winter_range} km</InfoPill>
        )}
        {listing.battery_health && (
          <InfoPill>Batterie {listing.battery_health}%</InfoPill>
        )}
        {listing.heat_pump && <InfoPill>Wärmepumpe</InfoPill>}
        {listing.garantie && <InfoPill>Garantie</InfoPill>}
        {listing.pickerl && <InfoPill>Pickerl</InfoPill>}
      </div>

      <div className="mt-auto pt-7">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            {listing.owner.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-gray-400">Anbieter</p>
            <p className="text-sm font-medium text-gray-900">
              {listing.owner.username}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          {listing.view_count.toLocaleString("de-DE")} Aufrufe ·{" "}
          {listing.favourite_count.toLocaleString("de-DE")} Favoriten
        </div>
      </div>
    </aside>
  );
}
