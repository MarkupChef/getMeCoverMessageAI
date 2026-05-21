import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BillingView } from "@/views/billing";
import { renderWithIntl } from "./render-with-intl";

describe("BillingView", () => {
  it("renders the billing empty state", () => {
    renderWithIntl(<BillingView />);

    expect(screen.getByRole("heading", { name: "Billing" })).toBeInTheDocument();
    expect(
      screen.getByText("Billing is not configured yet"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View plan" })).toHaveAttribute(
      "href",
      "/plan",
    );
  });
});
