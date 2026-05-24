import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeAnonymousUsageLimitAction,
  getAnonymousUsageLimitAction,
} from "@/features/anonymous-usage/api/actions";
import { HomeView } from "@/views/home";
import { ThemeProvider } from "@/shared/lib/theme";
import { renderWithIntl } from "./render-with-intl";

const mockedConsumeAnonymousUsageLimitAction = vi.mocked(
  consumeAnonymousUsageLimitAction,
);
const mockedGetAnonymousUsageLimitAction = vi.mocked(getAnonymousUsageLimitAction);

describe("HomeView", () => {
  beforeEach(() => {
    mockedConsumeAnonymousUsageLimitAction.mockClear();
    mockedGetAnonymousUsageLimitAction.mockClear();
  });

  it("renders guest navigation and sign-up CTA", async () => {
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
    const workspace = screen
      .getByRole("heading", { name: "Your feature workspace" })
      .closest("div");

    expect(workspace).not.toBeNull();
    expect(
      within(workspace as HTMLElement).getByRole("button", { name: "Generate" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText("2 credits"),
    ).toBeInTheDocument();
    expect(screen.getByText("Anonymous free-credit limits")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Your AI feature can be here",
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
      screen.queryByLabelText("2 credits"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Create account" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Start with auth" }),
    ).not.toBeInTheDocument();
  });

  it("updates the guest credit counter and upgrade CTA after free credits end", async () => {
    const user = userEvent.setup();
    mockedConsumeAnonymousUsageLimitAction
      .mockResolvedValueOnce({
        status: "consumed",
        used: 1,
        limit: 2,
        remaining: 1,
      })
      .mockResolvedValueOnce({
        status: "consumed",
        used: 2,
        limit: 2,
        remaining: 0,
      });

    renderWithIntl(
      <ThemeProvider>
        <HomeView authState={{ status: "guest" }} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Generate" }));
    expect(await screen.findByLabelText("1 credit")).toBeInTheDocument();
    expect(screen.queryByText("1 free credit left.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => {
      expect(screen.getByLabelText("0 credits")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "Upgrade Plan" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(
      screen.queryByText("Your free credits have ended."),
    ).not.toBeInTheDocument();
  });

  it("shows unavailable guest usage feedback without crashing", async () => {
    mockedGetAnonymousUsageLimitAction.mockResolvedValueOnce({
      status: "unavailable",
    });

    renderWithIntl(
      <ThemeProvider>
        <HomeView authState={{ status: "guest" }} />
      </ThemeProvider>,
    );

    expect(
      await screen.findByLabelText("Credits unavailable"),
    ).toBeInTheDocument();
  });
});
