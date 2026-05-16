import { expect, test } from "@playwright/test";

test("public home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("http://127.0.0.1:3100/en");
  await expect(page.getByRole("heading", { name: /scalable SaaS foundation/i })).toBeVisible();
});

test("sign in page loads", async ({ page }) => {
  await page.goto("/en/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("sign in empty submit shows validation without GET query params", async ({ page }) => {
  await page.goto("/en/sign-in");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page).toHaveURL("http://127.0.0.1:3100/en/sign-in");
});

test("sign up empty submit shows validation without GET query params", async ({ page }) => {
  await page.goto("/en/sign-up");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Full name is required.")).toBeVisible();
  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page.getByText("Confirm your password.")).toBeVisible();
  await expect(page).toHaveURL("http://127.0.0.1:3100/en/sign-up");
});

test("Google sign in button posts to the OAuth route", async ({ page }) => {
  let googleRequestMethod = "";

  await page.route("**/en/auth/google", async (route) => {
    googleRequestMethod = route.request().method();
    await route.fulfill({
      status: 303,
      headers: {
        location: "/en/sign-in?authError=OAuth%20test%20redirect",
      },
    });
  });

  await page.goto("/en/sign-in");
  await page.getByRole("button", { name: "Continue with Google" }).click();

  await expect(page).toHaveURL(/\/en\/sign-in\?authError=OAuth%20test%20redirect$/);
  expect(googleRequestMethod).toBe("POST");
});

test("sign out route redirects to sign in", async ({ request }) => {
  const response = await request.post("/en/auth/sign-out", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(303);
  expect(response.headers().location).toBe("http://localhost:3100/en/sign-in");
});

test("forgot password page loads", async ({ page }) => {
  await page.goto("/en/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
});

test("dashboard redirects unauthenticated users", async ({ page }) => {
  await page.goto("/en/dashboard");
  await expect(page).toHaveURL(/\/en\/sign-in$/);
});

test("language switcher changes the active locale", async ({ page }) => {
  await page.goto("/en");
  await page.getByLabel("Language").selectOption("uk");

  await expect(page).toHaveURL("http://127.0.0.1:3100/uk");
  await expect(page.getByRole("link", { name: "Увійти" })).toBeVisible();
});
