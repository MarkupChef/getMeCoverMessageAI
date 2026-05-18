import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserMenu } from "@/widgets/user-menu";
import { renderWithIntl } from "./render-with-intl";

const i18nRouter = (
  globalThis as unknown as {
    __i18nRouter: {
      replace: ReturnType<typeof vi.fn>;
      refresh: ReturnType<typeof vi.fn>;
    };
  }
).__i18nRouter;

describe("UserMenu", () => {
  beforeEach(() => {
    i18nRouter.replace.mockReset();
    i18nRouter.refresh.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 200 }))),
    );
  });

  it("posts to sign out when the menu item is selected", async () => {
    const user = userEvent.setup();
    renderWithIntl(<UserMenu email="founder@example.com" />);

    await user.click(screen.getByRole("button", { name: /founder@example\.com/ }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(fetch).toHaveBeenCalledWith("/auth/sign-out", {
      method: "POST",
    });
    expect(i18nRouter.replace).toHaveBeenCalledWith("/sign-in");
    expect(i18nRouter.refresh).toHaveBeenCalled();
  });
});
