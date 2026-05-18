import { redirect } from "next/navigation";
import { getServerAuthState } from "@/entities/session";
import { SignInView } from "@/views/sign-in";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

type SignInPageProps = {
  params: Promise<{
    locale?: string;
  }>;
  searchParams?: Promise<{
    authError?: string | string[];
  }>;
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  params,
  searchParams,
}: SignInPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = getSupportedLocale(requestedLocale);
  const authState = await getServerAuthState();

  if (authState.status === "authenticated") {
    redirect(getLocalizedPath(locale, "/dashboard"));
  }

  const query = await searchParams;
  const authError = Array.isArray(query?.authError)
    ? query.authError[0]
    : query?.authError;

  return <SignInView oauthError={authError} />;
}
