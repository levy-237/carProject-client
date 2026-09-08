import { expect, type Locator, type Page } from "@playwright/test";

export async function readListing(card: Locator) {
  await expect(card).toBeVisible({ timeout: 15_000 });
  const href = await card.getAttribute("href");
  if (!href) throw new Error("The listing card must link to its details page.");

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
