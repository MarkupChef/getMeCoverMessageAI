import { AuthCard, ForgotPasswordForm } from "@/features/auth";
import { useTranslations } from "next-intl";

export function ForgotPasswordView() {
  const t = useTranslations("auth.card.forgotPassword");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title={t("title")}
        description={t("description")}
        footerText={t("footerText")}
        footerHref="/sign-in"
        footerLabel={t("footerLabel")}
      >
        <ForgotPasswordForm />
      </AuthCard>
    </main>
  );
}
