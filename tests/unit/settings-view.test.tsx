import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SettingsView } from "@/views/settings";
import { ThemeProvider } from "@/shared/lib/theme";
import { renderWithIntl } from "./render-with-intl";

describe("settings view", () => {
  it("renders personalization controls without account or billing placeholders", () => {
    renderWithIntl(
      <ThemeProvider>
        <SettingsView />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Change theme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Language" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
    expect(screen.queryByText("Billing")).not.toBeInTheDocument();
  });
});
