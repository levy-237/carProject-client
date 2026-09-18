import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("opens listings from the mobile menu and closes the menu", async ({ page }) => {
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Open menu", exact: true });
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("button", { name: "Fahrzeuge", exact: true }).click();
  const listingsLink = page.getByRole("link", { name: "Alle Fahrzeuge", exact: true });
  await expect(listingsLink).toBeVisible();
  await listingsLink.click();

  await expect(page).toHaveURL("/listings");
  await expect(page).toHaveTitle("Fahrzeuge | Eautokauf");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(listingsLink).not.toBeVisible();
});
