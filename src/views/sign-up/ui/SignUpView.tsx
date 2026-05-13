import { AuthCard, SignUpForm } from "@/features/auth";

export function SignUpView() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Create your account"
        description="Start with a personal profile. Teams are created inside the app."
        footerText="Already have an account?"
        footerHref="/sign-in"
        footerLabel="Sign in"
      >
        <SignUpForm />
      </AuthCard>
    </main>
  );
}
