import { Eye, Heart, Volume2 } from "lucide-react";
import Link from "next/link";
import FavoriteListingButton from "@/components/listings/FavoriteListingButton";
import { formatMileage, formatPrice, formatYear } from "@/lib/listings";
import type { Listing } from "@/types/listings";
import { useRouter } from "next/navigation";
import ModifyListingCompare from "./ModifyListingCompare";

function PremiumAdBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800"
      title="Premium-Anzeige"
    >
      <Volume2 className="size-3.5 fill-current" aria-hidden="true" />
      Anzeige
    </span>
  );
}

function SpecItem({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </span>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
      {children}
    </span>
  );
}

function ListingOwner({ username }: { username: string }) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">Anbieter</p>
        <p className="truncate text-sm font-medium text-gray-800">{username}</p>
      </div>
    </div>
  );
}

function ViewCount({ count }: { count: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-500">
      <Eye className="size-6" strokeWidth={1.5} aria-hidden="true" />
      <span>{count.toLocaleString("de-DE")}</span>
    </span>
  );
}

function FavouriteCount({ count }: { count: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-500">
      <Heart className="size-6" strokeWidth={1.5} aria-hidden="true" />
      <span>{count.toLocaleString("de-DE")}</span>
    </span>
  );
}

export default function ListingCard({
  listing,
  isFavourite = false,
  variant = "default",
  handleAddToCompare = () => {},
  isInCompare = () => false,
}: {
  listing: Listing;
  isFavourite: boolean;
  variant?: "default" | "owner";
  handleAddToCompare: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => void;
  isInCompare: (id: number) => boolean;
}) {
  const year = formatYear(listing.makeyear);

  const router = useRouter();

  return (
    <Link
      data-testid="listing-card"
      href={`/listings/${listing.id}`}
      className="relative group flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md md:h-100 md:flex-row"
    >
      <ModifyListingCompare
        id={Number(listing.id)}
        handleAddToCompare={handleAddToCompare}
        isInCompare={isInCompare}
      />
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gray-100 md:aspect-auto md:h-full md:w-[40%]">
        <img
          src={listing.cover_image?.image ?? "/placeholder.png"}
          alt={listing.title}
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex min-w-0 items-start gap-2">
          {listing.is_premium && <PremiumAdBadge />}
          <h2 className="min-w-0 line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
            {listing.title}
          </h2>
        </div>

        <p className="mt-1 truncate text-sm text-gray-500">
          {listing.model_detail.name}
          <span className="mx-1.5 text-gray-300">·</span>
          {listing.model_trim_detail.name}
        </p>

        <p className="mt-4 text-2xl font-bold text-gray-900">
          {formatPrice(listing.price)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <SpecItem label="Zustand" value={listing.condition_detail.name} />
          <SpecItem label="Baujahr" value={year} />
          <SpecItem label="Leistung" value={`${listing.power} PS`} />
          {listing.model_trim_detail.drivetrain_detail && (
            <SpecItem
              label="Antrieb"
              value={listing.model_trim_detail.drivetrain_detail.name}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <InfoPill>{formatMileage(listing.mileage)}</InfoPill>
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

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          {variant === "default" ? (
            <>
              <ListingOwner username={listing.owner.username} />
              <div className="flex shrink-0 items-center gap-3">
                <ViewCount count={listing.view_count} />
                <FavoriteListingButton
                  isFavourite={isFavourite}
                  listingId={listing.id}
                />
              </div>
            </>
          ) : (
            <>
              <ViewCount count={listing.view_count} />
              <FavouriteCount count={listing.favourite_count} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
