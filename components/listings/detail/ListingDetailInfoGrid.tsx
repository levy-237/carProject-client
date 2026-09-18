import { formatDate } from "@/lib/format";
import { formatMileage, formatYear } from "@/lib/listings";
import type { Listing } from "@/types/listings";
import {
  formatBoolean,
  formatOptionalValue,
  formatPositiveNumber,
  getListingStatus,
} from "../listingDisplay";
import DetailSection, { DetailRow } from "./DetailSection";

export default function ListingDetailInfoGrid({
  listing,
}: {
  listing: Listing;
}) {
  const year = formatYear(listing.makeyear);
  const status = getListingStatus(listing);
  const trim = listing.model_trim_detail;
  const drivetrain = trim?.drivetrain_name ?? trim?.drivetrain_detail?.name;

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <DetailSection title="Fahrzeugdetails">
        <DetailRow label="Marke" value={listing.brand_detail.name} />
        <DetailRow label="Modell" value={listing.model_detail.name} />
        <DetailRow label="Trim" value={trim?.name ?? "—"} />
        <DetailRow label="Zustand" value={listing.condition_detail.name} />
        <DetailRow label="Karosserie" value={listing.body_type_detail.name} />
        <DetailRow label="Baujahr" value={year} />
        <DetailRow label="Kilometerstand" value={formatMileage(listing.mileage)} />
        <DetailRow label="Leistung" value={`${listing.power} PS`} />
        {drivetrain && <DetailRow label="Antrieb" value={drivetrain} />}
      </DetailSection>

      <DetailSection title="Batterie & Reichweite">
        <DetailRow
          label="Batteriegröße"
          value={formatOptionalValue(trim?.battery_size, " kWh")}
        />
        <DetailRow
          label="Werksreichweite"
          value={formatOptionalValue(trim?.factory_range, " km")}
        />
        <DetailRow
          label="Batteriezustand"
          value={formatOptionalValue(listing.battery_health, "%")}
        />
        <DetailRow
          label="Sommerreichweite"
          value={formatOptionalValue(listing.real_summer_range, " km")}
        />
        <DetailRow
          label="Winterreichweite"
          value={formatOptionalValue(listing.real_winter_range, " km")}
        />
      </DetailSection>

      <DetailSection title="Laden">
        <DetailRow
          label="AC-Laden"
          value={formatPositiveNumber(trim?.max_ac_charge_kw, " kW")}
        />
        <DetailRow
          label="DC-Laden"
          value={formatPositiveNumber(trim?.max_dc_charge_kw, " kW")}
        />
        <DetailRow
          label="20-80 % Laden"
          value={formatPositiveNumber(trim?.twenty_to_eighty_charge_min, " Min.")}
        />
      </DetailSection>

      <DetailSection title="Ausstattung">
        <DetailRow label="Wärmepumpe" value={formatBoolean(listing.heat_pump)} />
        <DetailRow label="Garantie" value={formatBoolean(listing.garantie)} />
        <DetailRow label="Pickerl" value={formatBoolean(listing.pickerl)} />
      </DetailSection>

      <DetailSection title="Anzeige">
        <DetailRow label="Veröffentlicht" value={formatDate(listing.publish_date)} />
        <DetailRow label="Status" value={status.label} />
        <DetailRow label="Premium" value={formatBoolean(listing.is_premium)} />
        <DetailRow
          label="Aufrufe"
          value={listing.view_count.toLocaleString("de-DE")}
        />
        <DetailRow
          label="Favoriten"
          value={listing.favourite_count.toLocaleString("de-DE")}
        />
        <DetailRow
          label="Bilder"
          value={listing.images.length.toLocaleString("de-DE")}
        />
      </DetailSection>
    </div>
  );
}
