import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardView } from "@/views/dashboard";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("DashboardView", () => {
  it("renders dashboard shell content", () => {
    render(
      <DashboardLayout userEmail="founder@example.com">
        <DashboardView />
      </DashboardLayout>,
    );

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getAllByText("SaaS Starter").length).toBeGreaterThan(0);
    expect(screen.getByText("founder@example.com")).toBeInTheDocument();
  });
});
