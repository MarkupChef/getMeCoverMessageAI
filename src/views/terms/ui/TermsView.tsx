import { useTranslations } from "next-intl";
import type { ServerAuthState } from "@/entities/session";
import { SiteHeader } from "@/widgets/site-header";
import { UserMenu } from "@/widgets/user-menu";

type TermsViewProps = {
  authState: ServerAuthState;
};

export function TermsView({ authState }: TermsViewProps) {
  const t = useTranslations("terms");
  const isAuthenticated = authState.status === "authenticated";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        isAuthenticated={isAuthenticated}
        userMenu={
          isAuthenticated ? (
            <UserMenu email={authState.user.email ?? "member@example.com"} />
          ) : undefined
        }
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-muted-foreground">{t("body")}</p>
      </main>
    </div>
  );
}
