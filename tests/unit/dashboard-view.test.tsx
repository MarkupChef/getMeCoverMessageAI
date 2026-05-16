import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardView } from "@/views/dashboard";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { ThemeProvider } from "@/shared/lib/theme";
import { renderWithIntl } from "./render-with-intl";

describe("DashboardView", () => {
  it("renders dashboard shell content", () => {
    renderWithIntl(
      <ThemeProvider>
        <DashboardLayout userEmail="founder@example.com">
          <DashboardView />
        </DashboardLayout>
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getAllByText("SaaS Starter").length).toBeGreaterThan(0);
    expect(screen.getByText("founder@example.com")).toBeInTheDocument();
  });
});
