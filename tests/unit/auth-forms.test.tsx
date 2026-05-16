import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignInForm, SignUpForm } from "@/features/auth";
import { signInAction, signUpAction } from "@/features/auth/api/actions";
import { renderWithIntl } from "./render-with-intl";

vi.mock("@/features/auth/api/actions", () => ({
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("auth forms", () => {
  beforeEach(() => {
    vi.mocked(signInAction).mockReset();
    vi.mocked(signUpAction).mockReset();
    window.history.replaceState(null, "", "/");
  });

  it("shows sign in errors for empty fields without calling the server action", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SignInForm />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(signInAction).not.toHaveBeenCalled();
  });

  it("shows sign up errors for empty fields without calling the server action", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SignUpForm />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getAllByText("Password is required.")).toHaveLength(1);
    expect(screen.getByText("Confirm your password.")).toBeInTheDocument();
    expect(signUpAction).not.toHaveBeenCalled();
  });

  it("shows meaningful errors for invalid sign in values", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SignInForm />);

    await user.type(screen.getByLabelText("Email"), "bad-email");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
    expect(signInAction).not.toHaveBeenCalled();
  });

  it("disables sign in submit while submitting valid credentials", async () => {
    const user = userEvent.setup();
    vi.mocked(signInAction).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: false }), 50)),
    );
    renderWithIntl(<SignInForm />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
    });
  });

  it("renders Google sign in as a POST form", () => {
    renderWithIntl(<SignInForm />);

    const googleButton = screen.getByRole("button", { name: "Continue with Google" });
    const googleForm = googleButton.closest("form");

    expect(googleForm).toHaveAttribute("method", "post");
    expect(googleForm).toHaveAttribute("action", "/en/auth/google");
  });
});
