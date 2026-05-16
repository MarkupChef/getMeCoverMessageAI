import { AuthCard, ResetPasswordForm } from "@/features/auth";
import { useTranslations } from "next-intl";

export function ResetPasswordView() {
  const t = useTranslations("auth.card.resetPassword");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title={t("title")}
        description={t("description")}
        footerText={t("footerText")}
        footerHref="/sign-in"
        footerLabel={t("footerLabel")}
      >
        <ResetPasswordForm />
      </AuthCard>
    </main>
  );
}
