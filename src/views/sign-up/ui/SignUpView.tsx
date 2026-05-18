import { AuthCard, SignUpForm } from "@/features/auth";
import { useTranslations } from "next-intl";

export function SignUpView() {
  const t = useTranslations("auth.card.signUp");

  return (
    <AuthCard
      title={t("title")}
      description={t("description")}
      footerText={t("footerText")}
      footerHref="/sign-in"
      footerLabel={t("footerLabel")}
    >
      <SignUpForm />
    </AuthCard>
  );
}
