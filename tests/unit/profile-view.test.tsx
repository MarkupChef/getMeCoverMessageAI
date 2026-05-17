import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfileView } from "@/views/profile";
import { renderWithIntl } from "./render-with-intl";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("profile view", () => {
  it("renders account deletion controls", () => {
    renderWithIntl(
      <ProfileView
        email="jane@example.com"
        fullName="Jane Doe"
        freeGenerationsUsed={2}
        freeGenerationsLimit={5}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
  });

  it("validates confirmation email without calling the endpoint", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(window, "fetch");
    renderWithIntl(
      <ProfileView
        email="jane@example.com"
        fullName="Jane Doe"
        freeGenerationsUsed={2}
        freeGenerationsLimit={5}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(
      screen.getAllByRole("button", { name: "Delete account" }).at(-1)!,
    );

    expect(
      await screen.findByText(
        "Enter your current email to confirm account deletion.",
      ),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });

  it("disables submit while deletion is pending", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(window, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve(
                new Response(JSON.stringify({ ok: true }), {
                  status: 200,
                }),
              ),
            50,
          );
        }),
    );
    renderWithIntl(
      <ProfileView
        email="jane@example.com"
        fullName="Jane Doe"
        freeGenerationsUsed={2}
        freeGenerationsLimit={5}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.type(screen.getByLabelText("Account email"), "jane@example.com");
    await user.click(
      screen.getAllByRole("button", { name: "Delete account" }).at(-1)!,
    );

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: /delete account/i }).at(-1),
      ).toBeDisabled();
    });
    fetchMock.mockRestore();
  });
});
