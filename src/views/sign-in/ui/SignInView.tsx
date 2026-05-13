import { AuthCard, SignInForm } from "@/features/auth";

export function SignInView() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Welcome back"
        description="Sign in to continue to your workspace."
        footerText="No account?"
        footerHref="/sign-up"
        footerLabel="Create one"
      >
        <SignInForm />
      </AuthCard>
    </main>
  );
}
