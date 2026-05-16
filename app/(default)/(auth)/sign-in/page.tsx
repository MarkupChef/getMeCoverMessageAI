import { SignInView } from "@/views/sign-in";

type SignInPageProps = {
  searchParams?: Promise<{
    authError?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const authError = Array.isArray(params?.authError)
    ? params.authError[0]
    : params?.authError;

  return <SignInView oauthError={authError} />;
}
