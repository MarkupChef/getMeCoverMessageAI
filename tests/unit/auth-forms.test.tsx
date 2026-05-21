import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import {
  ChangePasswordDialog,
  ChangePasswordForm,
  SignInForm,
  SignUpForm,
} from "@/features/auth";
import {
  changePasswordAction,
  signInAction,
  signUpAction,
} from "@/features/auth/api/actions";
import { renderWithIntl } from "./render-with-intl";

vi.mock("@/features/auth/api/actions", () => ({
  changePasswordAction: vi.fn(),
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
    vi.mocked(changePasswordAction).mockReset();
    vi.mocked(toast.error).mockReset();
    vi.mocked(toast.success).mockReset();
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

  it("shows the neutral signup success message from the server action", async () => {
    const user = userEvent.setup();
    vi.mocked(signUpAction).mockResolvedValue({
      ok: true,
      message:
        "Check your inbox. If an account can be created, we sent an email to continue.",
    });
    renderWithIntl(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Check your inbox. If an account can be created, we sent an email to continue.",
      );
    });
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
    expect(googleForm).toHaveAttribute("action", "/auth/google");
  });

  it("shows password change errors for empty fields without calling the server action", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ChangePasswordForm />);

    await user.click(screen.getByRole("button", { name: "Update password" }));

    await screen.findByText("Confirm your password.");
    expect(screen.getAllByText("Password is required.")).toHaveLength(2);
    expect(screen.getByText("Confirm your password.")).toBeInTheDocument();
    expect(changePasswordAction).not.toHaveBeenCalled();
  });

  it("toggles password field visibility", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ChangePasswordForm />);

    const currentPasswordInput = screen.getByLabelText("Current password");
    expect(currentPasswordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getAllByRole("button", { name: "Show or hide password" })[0],
    );
    expect(currentPasswordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getAllByRole("button", { name: "Show or hide password" })[0],
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");
  });

  it("calls the success handler after changing the password", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    vi.mocked(changePasswordAction).mockResolvedValue({
      ok: true,
      message: "Password updated.",
    });
    renderWithIntl(<ChangePasswordForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Current password"), "password123");
    await user.type(screen.getByLabelText("New password"), "newpassword123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newpassword123",
    );
    await user.click(screen.getByRole("button", { name: "Update password" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Current password")).toHaveValue("");
  });

  it("shows password change success in the dialog", async () => {
    const user = userEvent.setup();
    vi.mocked(changePasswordAction).mockResolvedValue({
      ok: true,
      message: "Password updated.",
    });
    renderWithIntl(<ChangePasswordDialog />);

    await user.click(screen.getByRole("button", { name: "Change password" }));
    await user.type(screen.getByLabelText("Current password"), "password123");
    await user.type(screen.getByLabelText("New password"), "newpassword123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newpassword123",
    );
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      await screen.findByRole("heading", { name: "Password updated" }),
    ).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Close" })[0]);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Password updated" }),
      ).not.toBeInTheDocument();
    });
  });
});
