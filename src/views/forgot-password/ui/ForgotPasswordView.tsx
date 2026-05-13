import { AuthCard, ForgotPasswordForm } from "@/features/auth";

export function ForgotPasswordView() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Reset password"
        description="Enter your email and we will send reset instructions."
        footerText="Remembered it?"
        footerHref="/sign-in"
        footerLabel="Sign in"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </main>
  );
}
