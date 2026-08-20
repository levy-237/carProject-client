"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSerializer } from "nuqs/server";
import DropDownFilter, { type SelectedFilterIds } from "./DropDownFilter";
import DetailSearchModal from "./DetailSearchModal";
import FiltersDelete from "./FiltersDelete";
import SearchBar from "./SearchBar";
import {
  detailSearchParsers,
  fromFilterToApiUrlSearch,
  getResetDetailSearchState,
} from "@/lib/detail-search";

const serializeDetailSearch = createSerializer(detailSearchParsers);

export default function LandingSearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<SelectedFilterIds>([]);
  const [selectedModels, setSelectedModels] = useState<SelectedFilterIds>([]);
  const [selectedTrims, setSelectedTrims] = useState<SelectedFilterIds>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<SelectedFilterIds>(
    [],
  );

  const [selectedProvince, setSelectedProvince] = useState<SelectedFilterIds>(
    [],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {
      ...getResetDetailSearchState(),
      search: search.trim() || null,
      brand: selectedBrands.length > 0 ? selectedBrands : null,
      model: selectedModels.length > 0 ? selectedModels : null,
      modeltrim: selectedTrims.length > 0 ? selectedTrims : null,
      body: selectedBodyTypes.length > 0 ? selectedBodyTypes : null,
      province: selectedProvince.length > 0 ? selectedProvince : null,
    };
    router.push(`/listings${serializeDetailSearch(body)}`);
  }

  const handleReset = () => {
    setSearch("");
    setSelectedBrands([]);
    setSelectedModels([]);
    setSelectedTrims([]);
    setSelectedBodyTypes([]);
    setSelectedProvince([]);
  };

  return (
    <section className="relative flex h-fit items-center justify-center px-4 py-30 max-md:py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-2/3 bg-[url('/search-bg1.png')] bg-cover bg-bottom bg-no-repeat"
      />
      <form
        data-testid="landing-search-bar-form"
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-4xl rounded-3xl border border-gray-200 bg-white p-10 shadow-lg"
      >
        <SearchBar value={search} onChange={setSearch} />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DropDownFilter
            apiName="cars/brands"
            name="Marke"
            value={selectedBrands}
            onChange={setSelectedBrands}
            searchable
          />
          <DropDownFilter
            apiName={`cars/models${fromFilterToApiUrlSearch(selectedBrands)}`}
            name="Modell"
            value={selectedModels}
            onChange={setSelectedModels}
            disabled={selectedBrands.length === 0}
            searchable
          />
          <DropDownFilter
            apiName={`cars/trims${fromFilterToApiUrlSearch(selectedModels)}`}
            name="Trim"
            value={selectedTrims}
            disabled={selectedModels.length === 0}
            onChange={setSelectedTrims}
            searchable
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DropDownFilter
            apiName="cars/body-types"
            name="Karosserie"
            value={selectedBodyTypes}
            onChange={setSelectedBodyTypes}
            searchable
          />

          <DropDownFilter
            apiName="province"
            name="Bundesland"
            value={selectedProvince}
            onChange={setSelectedProvince}
            searchable={false}
          />
          <div className="w-full flex justify-center">
            <button
              type="submit"
              data-testid="search-button"
              className="w-[70%]  rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
            >
              Suchen
            </button>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-4">
          <FiltersDelete onReset={handleReset} />
          <DetailSearchModal />
        </div>
      </form>
    </section>
  );
}
