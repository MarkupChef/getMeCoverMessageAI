import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultDetailView } from "@/views/result-detail";
import { ResultsView } from "@/views/results";
import { renderWithIntl } from "./render-with-intl";

describe("ResultsView", () => {
  it("renders empty state and generator CTA", () => {
    renderWithIntl(<ResultsView />);

    expect(screen.getByRole("heading", { name: "Results" })).toBeInTheDocument();
    expect(screen.getByText("No results yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first result.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to generator" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

describe("ResultDetailView", () => {
  it("renders placeholder and back link", () => {
    renderWithIntl(<ResultDetailView />);

    expect(screen.getByRole("heading", { name: "Result" })).toBeInTheDocument();
    expect(screen.getByText("No result found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to results" })).toHaveAttribute(
      "href",
      "/results",
    );
  });
});
