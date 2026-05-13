import { AuthCard, ResetPasswordForm } from "@/features/auth";

export function ResetPasswordView() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Choose a new password"
        description="Use at least 8 characters."
        footerText="Back to"
        footerHref="/sign-in"
        footerLabel="sign in"
      >
        <ResetPasswordForm />
      </AuthCard>
    </main>
  );
}
