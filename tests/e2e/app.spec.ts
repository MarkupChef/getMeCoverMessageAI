import { expect, test } from "@playwright/test";

test("public home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
  await expect(page.getByRole("heading", { name: /scalable SaaS foundation/i })).toBeVisible();
});

test("default locale prefix redirects to canonical unprefixed routes", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");

  await page.goto("/en/sign-in");
  await expect(page).toHaveURL("http://127.0.0.1:3100/sign-in");
});

test("sign in page loads", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("sign in empty submit shows validation without GET query params", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page).toHaveURL("http://127.0.0.1:3100/sign-in");
});

test("sign up empty submit shows validation without GET query params", async ({ page }) => {
  await page.goto("/sign-up");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Full name is required.")).toBeVisible();
  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
  await expect(page.getByText("Confirm your password.")).toBeVisible();
  await expect(page).toHaveURL("http://127.0.0.1:3100/sign-up");
});

test("Google sign in button posts to the OAuth route", async ({ page }) => {
  let googleRequestMethod = "";

  await page.route("**/auth/google", async (route) => {
    googleRequestMethod = route.request().method();
    await route.fulfill({
      status: 303,
      headers: {
        location: "/sign-in?authError=OAuth%20test%20redirect",
      },
    });
  });

  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Continue with Google" }).click();

  await expect(page).toHaveURL(/\/sign-in\?authError=OAuth%20test%20redirect$/);
  expect(googleRequestMethod).toBe("POST");
});

test("sign out route redirects to sign in", async ({ request }) => {
  const response = await request.post("/auth/sign-out", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(303);
  expect(response.headers().location).toBe("http://localhost:3100/sign-in");
});

test("forgot password page loads", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
});

test("dashboard redirects unauthenticated users", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("prefixed dashboard redirects unauthenticated users to prefixed sign in", async ({ page }) => {
  await page.goto("/uk/dashboard");
  await expect(page).toHaveURL(/\/uk\/sign-in$/);
});

test("profile redirects unauthenticated users", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("prefixed profile redirects unauthenticated users to prefixed sign in", async ({ page }) => {
  await page.goto("/uk/profile");
  await expect(page).toHaveURL(/\/uk\/sign-in$/);
});

test("language switcher changes the active locale", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Language").selectOption("uk");

  await expect(page).toHaveURL("http://127.0.0.1:3100/uk");

  await page.getByRole("combobox").selectOption("en");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
});
