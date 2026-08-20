import { fireEvent, render, screen } from "@testing-library/react";
import LandingSearchBar from "@/components/filters/LandingSearchBar";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { useRouter } from "next/navigation";

describe("Landing Page", () => {
  it("renders the landing search bar", () => {
    render(
      <NuqsTestingAdapter>
        <LandingSearchBar />
      </NuqsTestingAdapter>,
    );

    const landingSearchBarForm = screen.getByTestId("landing-search-bar-form");

    expect(landingSearchBarForm).toBeInTheDocument();
  });

  it("navigates to the listings page when  the search button is clicked", () => {
    render(
      <NuqsTestingAdapter>
        <LandingSearchBar />
      </NuqsTestingAdapter>,
    );

    const searchButton = screen.getByTestId("search-button");
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);
    expect(useRouter().push).toHaveBeenCalledWith("/listings");
  });
});
// const dropDownFilterButton = screen.getByTestId("drop-down-filter-button");
// expect(dropDownFilterButton).toBeInTheDocument();

// fireEvent.click(dropDownFilterButton);
// const dropDownFilterOption = screen.getByTestId("drop-down-filter-option");
// expect(dropDownFilterOption).toBeInTheDocument();
