import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingView } from "@/views/pricing";
import { ThemeProvider } from "@/shared/lib/theme";
import { renderWithIntl } from "./render-with-intl";

describe("PricingView", () => {
  it("renders public pricing cards with sign-up CTAs", () => {
    renderWithIntl(
      <ThemeProvider>
        <PricingView authState={{ status: "guest" }} mode="public" />
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Pricing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("Limited Background Removal")).toBeInTheDocument();
    expect(screen.getByText("600 AI Credits Monthly")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByRole("link", { name: "Upgrade" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });

  it("renders account plan with disabled upgrade placeholder", () => {
    renderWithIntl(<PricingView mode="account" />);

    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/results",
    );
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeDisabled();
    expect(
      screen.getByText("Stripe checkout will be connected later."),
    ).toBeInTheDocument();
  });
});
