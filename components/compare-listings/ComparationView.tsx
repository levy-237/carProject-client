import Link from "next/link";
import {
  formatBoolean,
  formatOptionalValue,
  formatPositiveNumber,
  getListingStatus,
} from "@/components/listings/listingDisplay";
import { formatDate } from "@/lib/format";
import {
  formatMileage,
  formatPrice,
  formatYear,
} from "@/lib/listings";
import type { Listing } from "@/types/listings";

function CompareSpecRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function ListingStatuses({ listing }: { listing: Listing }) {
  const badges = [];

  if (listing.is_premium) {
    badges.push({
      label: "Premium",
      className: "bg-amber-100 text-amber-800",
    });
  }
  badges.push(getListingStatus(listing));

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <StatusBadge key={badge.label} {...badge} />
      ))}
    </div>
  );
}

function CompareListingCard({ listing }: { listing: Listing }) {
  const year = formatYear(listing.makeyear);
  const trim = listing.model_trim_detail;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={listing.cover_image?.image ?? "/placeholder.png"}
          alt={listing.title}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <ListingStatuses listing={listing} />

        <h2 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
          {listing.title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {listing.brand_detail.name}
          <span className="mx-1.5 text-gray-300">·</span>
          {listing.model_detail.name}
        </p>

        <p className="mt-4 text-2xl font-bold text-gray-900">
          {formatPrice(listing.price)}
        </p>

        <dl className="mt-6 flex-1">
          <CompareSpecRow label="Trim" value={trim?.name ?? "—"} />
          <CompareSpecRow label="Zustand" value={listing.condition_detail.name} />
          <CompareSpecRow label="Karosserie" value={listing.body_type_detail.name} />
          <CompareSpecRow label="Baujahr" value={year} />
          <CompareSpecRow label="Kilometerstand" value={formatMileage(listing.mileage)} />
          <CompareSpecRow label="Leistung" value={`${listing.power} PS`} />
          <CompareSpecRow
            label="Antrieb"
            value={trim?.drivetrain_name ?? trim?.drivetrain_detail?.name ?? "—"}
          />
          <CompareSpecRow
            label="Batteriezustand"
            value={
              listing.battery_health != null
                ? `${listing.battery_health}%`
                : "—"
            }
          />
          <CompareSpecRow
            label="Sommerreichweite"
            value={formatOptionalValue(listing.real_summer_range, " km")}
          />
          <CompareSpecRow
            label="Winterreichweite"
            value={formatOptionalValue(listing.real_winter_range, " km")}
          />
          <CompareSpecRow label="Wärmepumpe" value={formatBoolean(listing.heat_pump)} />
          <CompareSpecRow label="Garantie" value={formatBoolean(listing.garantie)} />
          <CompareSpecRow label="Pickerl" value={formatBoolean(listing.pickerl)} />
          <CompareSpecRow
            label="DC-Laden"
            value={formatPositiveNumber(trim?.max_dc_charge_kw, " kW")}
          />
          <CompareSpecRow
            label="AC-Laden"
            value={formatPositiveNumber(trim?.max_ac_charge_kw, " kW")}
          />
          <CompareSpecRow
            label="20–80 % Laden"
            value={formatPositiveNumber(
              trim?.twenty_to_eighty_charge_min,
              " Min.",
            )}
          />
          <CompareSpecRow label="Aufrufe" value={listing.view_count.toLocaleString("de-DE")} />
          <CompareSpecRow
            label="Favoriten"
            value={listing.favourite_count.toLocaleString("de-DE")}
          />
          <CompareSpecRow label="Veröffentlicht" value={formatDate(listing.publish_date)} />
          <CompareSpecRow label="Anbieter" value={listing.owner.username} />
        </dl>

        {listing.description && (
          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Beschreibung
            </h3>
            <p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-6 text-gray-700">
              {listing.description}
            </p>
          </div>
        )}

        <Link
          href={`/listings/${listing.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
        >
          Anzeige ansehen
        </Link>
      </div>
    </article>
  );
}

function CompareEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        Keine Fahrzeuge zum Vergleichen
      </h2>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        Wähle bis zu 3 Anzeigen auf der Listing-Seite aus und klicke auf
        „Vergleichen“.
      </p>
      <Link
        href="/listings"
        className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
      >
        Zu den Anzeigen
      </Link>
    </div>
  );
}

export default function ComparationView({ listings }: { listings: Listing[] }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        ← Zurück zu den Anzeigen
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Fahrzeugvergleich
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {listings.length}{" "}
          {listings.length === 1 ? "Fahrzeug" : "Fahrzeuge"} im Vergleich
        </p>
      </div>

      {listings.length > 0 ? (
        <div
          className={`mt-8 grid gap-6 ${
            listings.length === 1
              ? "max-w-md"
              : listings.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {listings.map((listing) => (
            <CompareListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <CompareEmptyState />
        </div>
      )}
    </main>
  );
}
