import { describe, expect, it, vi } from "vitest";
import { getServerAuthState } from "@/entities/session";
import SignInPage from "../../app/[locale]/(auth)/sign-in/page";
import SignUpPage from "../../app/[locale]/(auth)/sign-up/page";

vi.mock("@/entities/session", () => ({
  getServerAuthState: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

describe("auth page redirects", () => {
  it("redirects authenticated users away from sign in", async () => {
    vi.mocked(getServerAuthState).mockResolvedValue({
      status: "authenticated",
      user: { id: "user-id", email: "founder@example.com" },
    });

    await expect(
      SignInPage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });

  it("redirects authenticated users away from localized sign up", async () => {
    vi.mocked(getServerAuthState).mockResolvedValue({
      status: "authenticated",
      user: { id: "user-id", email: "founder@example.com" },
    });

    await expect(
      SignUpPage({
        params: Promise.resolve({ locale: "uk" }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/uk/dashboard");
  });
});
