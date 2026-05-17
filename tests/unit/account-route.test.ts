import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE } from "../../app/api/account/route";
import { deleteCurrentAccount } from "@/features/delete-account";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";

vi.mock("@/features/delete-account", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/delete-account")>();

  return {
    ...actual,
    deleteCurrentAccount: vi.fn(),
  };
});

vi.mock("@/shared/api/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/shared/config/env", () => ({
  hasPublicEnv: vi.fn(),
}));

vi.mock("@/shared/config/server-env", () => ({
  hasAccountDeletionEnv: vi.fn(),
}));

describe("DELETE /api/account", () => {
  const signOut = vi.fn();

  beforeEach(() => {
    vi.mocked(hasPublicEnv).mockReturnValue(true);
    vi.mocked(hasAccountDeletionEnv).mockReturnValue(true);
    vi.mocked(deleteCurrentAccount).mockReset();
    signOut.mockReset();
  });

  function mockUser(user: { id: string; email: string } | null) {
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user } }),
        signOut,
      },
    } as never);
  }

  function createDeleteRequest(email: string) {
    return new Request("http://localhost/api/account", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "127.0.0.1",
      },
      body: JSON.stringify({ email }),
    });
  }

  it("returns unauthorized when there is no signed-in user", async () => {
    mockUser(null);

    const response = await DELETE(createDeleteRequest("jane@example.com") as never);

    expect(response.status).toBe(401);
    expect(deleteCurrentAccount).not.toHaveBeenCalled();
  });

  it("rejects mismatched confirmation email", async () => {
    mockUser({
      id: "user-id",
      email: "jane@example.com",
    });

    const response = await DELETE(createDeleteRequest("other@example.com") as never);

    expect(response.status).toBe(400);
    expect(deleteCurrentAccount).not.toHaveBeenCalled();
  });

  it("deletes the current account and signs out on success", async () => {
    const user = {
      id: "user-id",
      email: "jane@example.com",
    };
    mockUser(user);
    vi.mocked(deleteCurrentAccount).mockResolvedValue(undefined);

    const response = await DELETE(createDeleteRequest("jane@example.com") as never);

    expect(response.status).toBe(200);
    expect(deleteCurrentAccount).toHaveBeenCalledWith({
      user,
      ip: "127.0.0.1",
    });
    expect(signOut).toHaveBeenCalled();
  });
});
