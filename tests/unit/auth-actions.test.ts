import { beforeEach, describe, expect, it, vi } from "vitest";
import { signUpAction } from "@/features/auth/api/actions";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { initializeAuthenticatedUsageIfConfigured } from "@/entities/usage";

const signUp = vi.fn();

vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/entities/usage", () => ({
  initializeAuthenticatedUsageIfConfigured: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(async () => "en"),
  getTranslations: vi.fn(async (namespace: string) => {
    const messages: Record<string, Record<string, string>> = {
      "auth.validation": {
        emailRequired: "Email is required.",
        emailInvalid: "Enter a valid email address.",
        passwordRequired: "Password is required.",
        passwordMin: "Password must be at least 8 characters.",
        fullNameRequired: "Full name is required.",
        fullNameMin: "Full name must be at least 2 characters.",
        fullNameMax: "Full name must be 120 characters or fewer.",
        confirmPasswordRequired: "Confirm your password.",
        passwordsMismatch: "Passwords do not match.",
      },
      "auth.messages": {
        authNotConfigured: "Authentication is not configured.",
        checkAccountDetails: "Check the submitted account details.",
        confirmAccount:
          "Check your inbox. If an account can be created, we sent an email to continue.",
        unableCreateAccount: "Unable to create account. Try again later.",
      },
    };

    return (key: string) => messages[namespace]?.[key] ?? key;
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("signUpAction", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    signUp.mockReset();
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: { signUp },
    } as never);
    vi.mocked(initializeAuthenticatedUsageIfConfigured).mockReset();
  });

  it("returns the neutral success message for a new email", async () => {
    signUp.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });

    await expect(
      signUpAction({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).resolves.toEqual({
      ok: true,
      message:
        "Check your inbox. If an account can be created, we sent an email to continue.",
    });
    expect(initializeAuthenticatedUsageIfConfigured).not.toHaveBeenCalled();
  });

  it("returns the same neutral success message for duplicate-like signup errors", async () => {
    signUp.mockResolvedValue({
      data: { user: null },
      error: {
        code: "user_already_exists",
        message: "User already registered",
        status: 422,
      },
    });

    await expect(
      signUpAction({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).resolves.toEqual({
      ok: true,
      message:
        "Check your inbox. If an account can be created, we sent an email to continue.",
    });
    expect(initializeAuthenticatedUsageIfConfigured).not.toHaveBeenCalled();
  });

  it("does not create usage for obfuscated successful signup responses", async () => {
    signUp.mockResolvedValue({
      data: { user: { id: "obfuscated-user-id", email: "jane@example.com" } },
      error: null,
    });

    await signUpAction({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(initializeAuthenticatedUsageIfConfigured).not.toHaveBeenCalled();
  });

  it("returns a generic failure for technical signup errors", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    signUp.mockResolvedValue({
      data: { user: null },
      error: {
        code: "unexpected_failure",
        message: "Database is unavailable",
        status: 500,
        name: "AuthApiError",
      },
    });

    await expect(
      signUpAction({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Unable to create account. Try again later.",
    });
    expect(consoleError).toHaveBeenCalledWith("Supabase sign up failed.", {
      code: "unexpected_failure",
      status: 500,
      name: "AuthApiError",
    });
    consoleError.mockRestore();
  });

  it("does not call Supabase when the input is invalid", async () => {
    await expect(
      signUpAction({
        fullName: "",
        email: "bad-email",
        password: "short",
        confirmPassword: "different",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Check the submitted account details.",
    });
    expect(signUp).not.toHaveBeenCalled();
  });
});
