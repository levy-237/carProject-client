import { test, expect } from "@playwright/test";
import { listingCards, readListing } from "./helpers/listings";

test("opens a car and displays its matching details", async ({ page }) => {
  await page.goto("/listings");
  const card = listingCards(page).first();
  const listing = await readListing(card);

  await card.getByRole("heading", { level: 2 }).click();
  await expect(page).toHaveURL(listing.href, { timeout: 15_000 });

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    listing.title
  );
  const summary = main.getByRole("complementary");
  await expect(summary.getByText(listing.price, { exact: true })).toBeVisible();
  await expect(
    summary.getByText(listing.mileage, { exact: true })
  ).toBeVisible();
  await expect(summary.getByText(listing.power, { exact: true })).toBeVisible();
  await expect(
    main.getByRole("heading", { name: "Fahrzeugdetails", exact: true })
  ).toBeVisible();

  await main.getByRole("link", { name: "Zurück zu den Anzeigen" }).click();
  await expect(page).toHaveURL("/listings");
});
