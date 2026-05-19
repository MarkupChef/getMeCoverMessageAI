import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeView } from "@/views/home";
import { ThemeProvider } from "@/shared/lib/theme";
import { renderWithIntl } from "./render-with-intl";

describe("HomeView", () => {
  it("renders guest navigation and sign-up CTA", () => {
    renderWithIntl(
      <ThemeProvider>
        <HomeView authState={{ status: "guest" }} />
      </ThemeProvider>,
    );

    const signInLinks = screen.getAllByRole("link", { name: "Sign in" });
    expect(signInLinks).toHaveLength(1);
    expect(signInLinks.every((link) => link.getAttribute("href") === "/sign-in")).toBe(
      true,
    );
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("link", { name: "Start with auth" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByText("Your generator here")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "A scalable SaaS foundation with the boring parts already wired.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Open results" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Language" })).not.toBeInTheDocument();
  });

  it("renders authenticated navigation without guest auth links", () => {
    renderWithIntl(
      <ThemeProvider>
        <HomeView
          authState={{
            status: "authenticated",
            user: { id: "user-id", email: "founder@example.com" },
          }}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole("link", { name: "Results" })).toHaveAttribute(
      "href",
      "/results",
    );
    expect(screen.getByRole("link", { name: "Plan" })).toHaveAttribute(
      "href",
      "/plan",
    );
    expect(screen.getByRole("link", { name: "Open results" })).toHaveAttribute(
      "href",
      "/results",
    );
    expect(
      screen.getByRole("button", { name: /founder@example\.com/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create account" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Start with auth" }),
    ).not.toBeInTheDocument();
  });
});
