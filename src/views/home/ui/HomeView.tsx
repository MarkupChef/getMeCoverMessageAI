import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServerAuthState } from "@/entities/session";
import { UserMenu } from "@/widgets/user-menu";
import { SiteHeader } from "@/widgets/site-header";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

const foundationKeys = [
  "registration",
  "signIn",
  "google",
  "passwordRecovery",
  "passwordChange",
  "accountDeletion",
  "protectedShell",
  "profile",
  "theme",
  "language",
  "supabase",
  "forms",
  "i18n",
  "extensions",
] as const;
const stepKeys = ["publicEnv", "serverEnv", "supabase"] as const;
type StepKey = (typeof stepKeys)[number];

const stepEnvVars: Partial<Record<StepKey, readonly string[]>> = {
  publicEnv: [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_APP_URL",
  ],
  serverEnv: ["SUPABASE_SERVICE_ROLE_KEY", "ACCOUNT_GUARD_HMAC_SECRET"],
};
const stackKeys = [
  "next",
  "react",
  "typescript",
  "tailwind",
  "ui",
  "supabase",
  "zod",
  "forms",
  "query",
  "theme",
  "i18n",
  "testing",
] as const;

type HomeViewProps = {
  authState: ServerAuthState;
};

export function HomeView({ authState }: HomeViewProps) {
  const t = useTranslations("home");
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
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px]">
          <div className="flex max-w-2xl flex-col gap-6">
            <Badge className="w-fit" variant="secondary">
              {t("badge")}
            </Badge>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
                {t("title")}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {t("hero.description")}
              </p>
            </div>
            <Button asChild className="w-fit" size="lg">
              <Link href={isAuthenticated ? "/results" : "/sign-up"}>
                {isAuthenticated ? t("actions.results") : t("actions.auth")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <Card className="border-dashed">
            <CardContent className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-md border bg-muted">
                <ArrowRight className="text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold tracking-normal">
                {t("generator.title")}
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t("generator.description")}
              </p>
            </CardContent>
          </Card>
        </section>
        <section className="border-t bg-muted/30">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-3">
              <Badge className="w-fit" variant="outline">
                {t("about.badge")}
              </Badge>
              <h2 className="text-2xl font-semibold tracking-normal">
                {t("about.title")}
              </h2>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {foundationKeys.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-md border bg-background p-3"
                >
                  <CheckCircle2 className="text-primary" data-icon="inline-start" />
                  <span className="text-sm font-medium">
                    {t(`checklist.items.${item}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-normal">
                {t("howItWorks.title")}
              </h2>
              <p className="text-muted-foreground">{t("howItWorks.description")}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {stepKeys.map((item) => (
                <div key={item} className="rounded-md border p-4">
                  <h3 className="font-medium">{t(`howItWorks.steps.${item}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`howItWorks.steps.${item}.description`)}
                  </p>
                  {stepEnvVars[item] ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stepEnvVars[item].map((envVar) => (
                        <code
                          key={envVar}
                          className="rounded-md border bg-muted px-2 py-1 font-mono text-xs text-foreground"
                        >
                          {envVar}
                        </code>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-t bg-muted/30">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-normal">
                {t("stack.title")}
              </h2>
              <p className="text-muted-foreground">{t("stack.description")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stackKeys.map((item) => (
                <div key={item} className="rounded-md border bg-background p-4">
                  <h3 className="font-medium">{t(`stack.items.${item}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`stack.items.${item}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
