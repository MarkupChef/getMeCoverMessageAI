import { AuthCard, SignInForm } from "@/features/auth";
import { useTranslations } from "next-intl";

type SignInViewProps = {
  oauthError?: string;
};

export function SignInView({ oauthError }: SignInViewProps) {
  const t = useTranslations("auth.card.signIn");

  return (
    <AuthCard
      title={t("title")}
      description={t("description")}
      footerText={t("footerText")}
      footerHref="/sign-up"
      footerLabel={t("footerLabel")}
    >
      <SignInForm oauthError={oauthError} />
    </AuthCard>
  );
}
