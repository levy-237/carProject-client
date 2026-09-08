import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });
  test("Displays login form", async ({ page }) => {
    await expect(page).toHaveTitle("Anmelden | Eautokauf");
    await expect(page.getByLabel("Benutzername")).toBeVisible();
    await expect(page.getByLabel("Passwort", { exact: true })).toBeVisible();
    await expect(
      page
        .locator("form")
        .getByRole("button", { name: "Anmelden", exact: true })
    ).toBeEnabled();
  });

  test("logs in the user with correct credentials", async ({ page }) => {
    const username = process.env.E2E_USER_USERNAME;
    const password = process.env.E2E_USER_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Set E2E_USER_USERNAME and E2E_USER_PASSWORD in .env or the environment."
      );
    }

    await page.getByLabel("Benutzername").fill(username);
    await page.getByLabel("Passwort", { exact: true }).fill(password);
    await page
      .locator("form")
      .getByRole("button", { name: "Anmelden", exact: true })
      .click();

    await expect(page).toHaveURL("/me", { timeout: 15_000 });
  });

  test("does not logs in the user with wrong credentials", async ({ page }) => {
    const username = process.env.E2E_USER_USERNAME;
    const password = process.env.E2E_USER_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Set E2E_USER_USERNAME and E2E_USER_PASSWORD in .env or the environment."
      );
    }

    await page.getByLabel("Benutzername").fill("wrong1221");
    await page.getByLabel("Passwort", { exact: true }).fill("qwrewf");
    await page
      .locator("form")
      .getByRole("button", { name: "Anmelden", exact: true })
      .click();

    await expect(page.getByTestId("login-error")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveURL("/login");
  });

  test("navigates user to password recovery", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Passwort vergessen?" }).click()
    );
    await expect(page).toHaveURL("forgot-password");
  });
  test("navigates user to user registration", async ({ page }) => {
    await page
      .getByRole("main")
      .getByRole("link", { name: "Registrieren", exact: true })
      .click();

    await expect(page).toHaveURL("/sign-up");
  });
  //TODO:registration test
});
