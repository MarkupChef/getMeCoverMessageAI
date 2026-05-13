import { expect, test } from "@playwright/test";

test("public home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /scalable SaaS foundation/i })).toBeVisible();
});

test("sign in page loads", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("forgot password page loads", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
});

test("dashboard redirects unauthenticated users", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
});
