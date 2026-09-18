import test, { expect } from "@playwright/test";
import { listingCards, sidebarModalTest } from "./helpers/listings";

test.describe("Listings list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/listings");
  });

  test("Displays listings correctly without filters", async ({ page }) => {
    const card = listingCards(page);
    const cardAmount = await card.count();
    const firstCard = card.first();

    await expect(firstCard).toHaveRole("link");
    await expect(firstCard).toHaveAttribute("href", /^\/listings\/[^/?#]+$/);
    expect(cardAmount === 15);
  });

  test("Karosserie filters listings and listing zurucksetzen button", async ({
    page,
  }) => {
    await sidebarModalTest({
      page,
      filterTitle: "Karosserie",
      filterName: "SUV",
      searchParamName: "body",
    });
    const removeFilter = page
      .getByTestId("listing-results")
      .getByRole("button", {
        name: "Zurücksetzen",
        exact: true,
      });
    await removeFilter.click();
    await expect(page).toHaveURL("/listings");
  });

  test("Modell and Trim filter listings and sidebar zurucksetzen button ", async ({
    page,
  }) => {
    await sidebarModalTest({
      page,
      filterTitle: "Marke",
      filterName: "Skoda",
      searchParamName: "brand",
    });
    await sidebarModalTest({
      page,
      filterTitle: "Modell",
      filterName: "Enyaq",
      searchParamName: "model",
    });
    await sidebarModalTest({
      page,
      filterTitle: "Trim",
      filterName: "85 82/77 kWh RWD",
      searchParamName: "modeltrim",
    });
    const sidebar = page.getByTestId("sidebar-filter");

    const removeFilters = sidebar.getByRole("button", {
      name: "Zurücksetzen",
      exact: true,
    });

    await removeFilters.click();
    await expect(page).toHaveURL("/listings");
  });
  test("filter modal opens", async ({ page }) => {
    const sidebar = page.getByTestId("sidebar-filter");
    const filterModalButton = sidebar.getByText("Weitere Filter");
    await filterModalButton.click();
    const filterModal = page.getByTestId("filterModal");
    await expect(filterModal).toBeVisible();
  });
});
