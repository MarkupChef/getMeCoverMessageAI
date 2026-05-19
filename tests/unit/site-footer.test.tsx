import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/widgets/site-footer";
import { renderWithIntl } from "./render-with-intl";

describe("SiteFooter", () => {
  it("renders legal links, contact email, and language switcher", () => {
    renderWithIntl(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(screen.getByText(/Contact:\s*youemail@example\.com/)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
  });
});
