import { expect, type Locator, type Page } from "@playwright/test";

export async function readListing(card: Locator) {
  await expect(card).toBeVisible({ timeout: 15_000 });
  const href = await card.getAttribute("href");
  if (!href) throw new Error("The listing card must link to its details page.");

  console.log(href);

  return {
    href,
    id: href.split("/").pop()!,
    title: (await card.getByRole("heading", { level: 2 }).innerText()).trim(),
    price: (await card.getByText(/^[\d.\s]+€$/).innerText()).trim(),
    mileage: (await card.getByText(/^[\d.]+ km$/).innerText()).trim(),
    power: (await card.getByText(/^\d+ PS$/).innerText()).trim(),
  };
}

export function listingCards(page: Page) {
  return page.getByRole("main").getByTestId("listing-card");
}

export async function sidebarModalTest({
  page,
  filterName,
  filterTitle,
  searchParamName,
}: {
  page: Page;
  filterName: string | RegExp;
  filterTitle: string;
  searchParamName: string;
}) {
  const sidebar = page.getByTestId("sidebar-filter");
  const filterButton = sidebar.getByRole("button", {
    name: filterTitle,
    exact: true,
  });
  await filterButton.click();

  const filterModal = sidebar.getByTestId("filter-modal");
  await expect(filterModal).toBeVisible();
  await filterModal.getByText(filterName, { exact: true }).click();

  await expect(page).toHaveURL((url) => url.searchParams.has(searchParamName));
  await sidebar.getByText(filterTitle, { exact: true }).click();

  const cards = listingCards(page);
  await expect(cards.first()).toContainText(filterName, { ignoreCase: true });

  for (const card of await cards.all()) {
    await expect(card).toContainText(filterName, { ignoreCase: true });
  }
}
