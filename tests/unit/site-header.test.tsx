import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/widgets/site-header";
import { renderWithIntl } from "./render-with-intl";

vi.mock("@/features/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

describe("SiteHeader", () => {
  it("shows authenticated navigation links inside the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SiteHeader isAuthenticated />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const menu = screen.getByRole("dialog", { name: "Navigation" });

    expect(within(menu).getByRole("link", { name: "Results" })).toHaveAttribute(
      "href",
      "/results",
    );
    expect(within(menu).getByRole("link", { name: "Plan" })).toHaveAttribute(
      "href",
      "/plan",
    );
  });

  it("shows guest navigation links inside the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SiteHeader isAuthenticated={false} />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const menu = screen.getByRole("dialog", { name: "Navigation" });

    expect(within(menu).getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  it("keeps the account menu before the mobile menu trigger", () => {
    renderWithIntl(
      <SiteHeader
        isAuthenticated
        userMenu={<button type="button">Account</button>}
      />,
    );

    const accountMenu = screen.getByRole("button", { name: "Account" });
    const mobileMenuTrigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    expect(
      accountMenu.compareDocumentPosition(mobileMenuTrigger) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
