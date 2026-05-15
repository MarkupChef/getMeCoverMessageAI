import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserMenu } from "@/widgets/user-menu";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

describe("UserMenu", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 200 }))),
    );
  });

  it("posts to sign out when the menu item is selected", async () => {
    const user = userEvent.setup();
    render(<UserMenu email="founder@example.com" />);

    await user.click(screen.getByRole("button", { name: /founder@example\.com/ }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(fetch).toHaveBeenCalledWith("/auth/sign-out", {
      method: "POST",
    });
    expect(replace).toHaveBeenCalledWith("/sign-in");
    expect(refresh).toHaveBeenCalled();
  });
});
