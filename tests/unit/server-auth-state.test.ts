import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerAuthState } from "@/entities/session";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";

vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/shared/config/env", () => ({
  hasPublicEnv: vi.fn(),
}));

describe("getServerAuthState", () => {
  const getUser = vi.fn();

  beforeEach(() => {
    getUser.mockReset();
    vi.mocked(hasPublicEnv).mockReturnValue(true);
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: { getUser },
    } as never);
  });

  it("returns guest when auth env is missing", async () => {
    vi.mocked(hasPublicEnv).mockReturnValue(false);

    await expect(getServerAuthState()).resolves.toEqual({ status: "guest" });
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  it("returns guest when there is no user", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    await expect(getServerAuthState()).resolves.toEqual({ status: "guest" });
  });

  it("returns the minimal authenticated user", async () => {
    getUser.mockResolvedValue({
      data: {
        user: {
          id: "user-id",
          email: "founder@example.com",
          user_metadata: { full_name: "Sensitive Client Copy" },
        },
      },
    });

    await expect(getServerAuthState()).resolves.toEqual({
      status: "authenticated",
      user: {
        id: "user-id",
        email: "founder@example.com",
      },
    });
  });
});
