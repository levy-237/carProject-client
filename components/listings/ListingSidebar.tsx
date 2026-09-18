"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DropDownFilter from "@/components/filters/DropDownFilter";
import DetailSearchModal from "@/components/filters/DetailSearchModal";
import RangeInput from "@/components/filters/RangeInput";
import SearchBar from "@/components/filters/SearchBar";
import {
  fromFilterToApiUrlSearch,
  ORDERING_OPTIONS,
  sideBarSearchParsers,
} from "@/lib/detail-search";
import { useQueryState } from "nuqs";
import FiltersDelete from "../filters/FiltersDelete";

export default function ListingSidebar() {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const [searchNuqs, setSearchNuqs] = useQueryState(
    "search",
    sideBarSearchParsers.search,
  );
  const [ordering, setOrdering] = useQueryState(
    "ordering",
    sideBarSearchParsers.ordering,
  );
  const [brand, setBrand] = useQueryState("brand", sideBarSearchParsers.brand);
  const [model, setModel] = useQueryState("model", sideBarSearchParsers.model);
  const [modeltrim, setModeltrim] = useQueryState(
    "modeltrim",
    sideBarSearchParsers.modeltrim,
  );
  const [body, setBody] = useQueryState("body", sideBarSearchParsers.body);
  const [province, setProvince] = useQueryState(
    "province",
    sideBarSearchParsers.province,
  );
  const [minprice, setMinprice] = useQueryState(
    "minprice",
    sideBarSearchParsers.minprice,
  );
  const [maxprice, setMaxprice] = useQueryState(
    "maxprice",
    sideBarSearchParsers.maxprice,
  );
  const [minmileage, setMinmileage] = useQueryState(
    "minmileage",
    sideBarSearchParsers.minmileage,
  );
  const [maxmileage, setMaxmileage] = useQueryState(
    "maxmileage",
    sideBarSearchParsers.maxmileage,
  );
  const [mindate, setMindate] = useQueryState(
    "mindate",
    sideBarSearchParsers.mindate,
  );
  const [maxdate, setMaxdate] = useQueryState(
    "maxdate",
    sideBarSearchParsers.maxdate,
  );

  const handleSubmit = () => {
    setSearchNuqs(search);
  };

  const handleReset = () => {
    router.push("/listings");
  };

  return (
    <aside
      className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg max-lg:hidden w-95 shrink-0"
      data-testid="sidebar-filter"
    >
      <SearchBar value={search} onChange={(search) => setSearch(search)} />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="listing-ordering"
          className="text-sm font-medium text-gray-700"
        >
          Sortierung
        </label>
        <div className="relative">
          <select
            id="listing-ordering"
            value={ordering}
            onChange={(event) => setOrdering(event.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium outline-none transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus:border-gray-400"
          >
            {ORDERING_OPTIONS.map((option) => (
              <option key={option.value || "standard"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
        </div>
      </div>

      <DropDownFilter
        apiName="cars/brands"
        name="Marke"
        value={brand}
        onChange={(brand) => {
          setBrand(brand);
          setModel([]);
          setModeltrim([]);
        }}
        searchable
      />
      <DropDownFilter
        apiName={`cars/models${fromFilterToApiUrlSearch(brand)}`}
        name="Modell"
        value={model}
        onChange={(model) => {
          setModel(model);
          setModeltrim([]);
        }}
        disabled={brand.length === 0}
        searchable
      />
      <DropDownFilter
        apiName={`cars/trims${fromFilterToApiUrlSearch(model)}`}
        name="Trim"
        value={modeltrim}
        disabled={model.length === 0}
        onChange={(modeltrim) => setModeltrim(modeltrim)}
        searchable
      />
      <DropDownFilter
        apiName="cars/body-types"
        name="Karosserie"
        value={body}
        onChange={(body) => setBody(body)}
        searchable
      />
      <DropDownFilter
        apiName="province"
        name="Bundesland"
        value={province}
        onChange={(province) => setProvince(province)}
        searchable={false}
      />

      <RangeInput
        label="Preis (€)"
        minValue={minprice}
        maxValue={maxprice}
        onMinChange={(minprice) => setMinprice(minprice)}
        onMaxChange={(maxprice) => setMaxprice(maxprice)}
      />
      <RangeInput
        label="Kilometerstand"
        minValue={minmileage}
        maxValue={maxmileage}
        onMinChange={(minmileage) => setMinmileage(minmileage)}
        onMaxChange={(maxmileage) => setMaxmileage(maxmileage)}
      />
      <RangeInput
        label="Baujahr"
        minValue={mindate}
        maxValue={maxdate}
        onMinChange={(mindate) => setMindate(mindate)}
        onMaxChange={(maxdate) => setMaxdate(maxdate)}
        minPlaceholder="Ab Jahr"
        maxPlaceholder="Bis Jahr"
      />

      <button
        type="button"
        className="mt-2 w-full rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
      >
        Suchen
      </button>

      <div className="flex flex-col gap-3 pt-1">
        <DetailSearchModal />

        <FiltersDelete onReset={handleReset} />
      </div>
    </aside>
  );
}
