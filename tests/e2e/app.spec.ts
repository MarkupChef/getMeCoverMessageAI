import { expect, test } from "@playwright/test";

test("public home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
  await expect(page.getByRole("heading", { name: /your AI generator goes here/i })).toBeVisible();
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

test("pricing page loads for unauthenticated users", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Free" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pro" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
});

test("prefixed pricing page loads with Ukrainian copy", async ({ page }) => {
  await page.goto("/uk/pricing");
  await expect(page.getByRole("heading", { name: "Ціни" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Продовжити" })).toBeVisible();
});

test("privacy page loads", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("link", { name: "SaaS Starter" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText("your Privacy Policy text here")).toBeVisible();
});

test("terms page loads", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("link", { name: "SaaS Starter" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  await expect(page.getByText("your Terms of Service text here")).toBeVisible();
});

test("prefixed legal pages load with Ukrainian copy", async ({ page }) => {
  await page.goto("/uk/privacy");
  await expect(
    page.getByRole("heading", { name: "Політика конфіденційності" }),
  ).toBeVisible();

  await page.goto("/uk/terms");
  await expect(page.getByRole("heading", { name: "Умови користування" })).toBeVisible();
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

test("results redirects unauthenticated users", async ({ page }) => {
  await page.goto("/results");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("prefixed results redirects unauthenticated users to prefixed sign in", async ({ page }) => {
  await page.goto("/uk/results");
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

test("settings redirects unauthenticated users", async ({ page }) => {
  await page.goto("/settings");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("billing redirects unauthenticated users", async ({ page }) => {
  await page.goto("/billing");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("prefixed billing redirects unauthenticated users to prefixed sign in", async ({ page }) => {
  await page.goto("/uk/billing");
  await expect(page).toHaveURL(/\/uk\/sign-in$/);
});

test("plan redirects unauthenticated users", async ({ page }) => {
  await page.goto("/plan");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test("prefixed plan redirects unauthenticated users to prefixed sign in", async ({ page }) => {
  await page.goto("/uk/plan");
  await expect(page).toHaveURL(/\/uk\/sign-in$/);
});

test("language switcher changes the active locale", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Language").selectOption("uk");

  await expect(page).toHaveURL("http://127.0.0.1:3100/uk");

  await page.getByRole("combobox").selectOption("en");
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
});
