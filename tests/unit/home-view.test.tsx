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
    expect(signInLinks).toHaveLength(2);
    expect(signInLinks.every((link) => link.getAttribute("href") === "/sign-in")).toBe(
      true,
    );
    expect(screen.getByRole("link", { name: "Create account" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByRole("link", { name: "Start with auth" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(
      screen.queryByRole("link", { name: "Open dashboard" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
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

    expect(screen.getAllByRole("link", { name: "Open dashboard" })).toHaveLength(2);
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
