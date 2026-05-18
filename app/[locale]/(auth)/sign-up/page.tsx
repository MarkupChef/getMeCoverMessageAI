import { redirect } from "next/navigation";
import { getServerAuthState } from "@/entities/session";
import { SignUpView } from "@/views/sign-up";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

type SignUpPageProps = {
  params: Promise<{
    locale?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = getSupportedLocale(requestedLocale);
  const authState = await getServerAuthState();

  if (authState.status === "authenticated") {
    redirect(getLocalizedPath(locale, "/dashboard"));
  }

  return <SignUpView />;
}
