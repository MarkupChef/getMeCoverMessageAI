import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServerAuthState } from "@/entities/session";
import { LanguageSwitcher } from "@/features/language-switcher";
import { ThemeToggle } from "@/features/theme-toggle";
import { UserMenu } from "@/widgets/user-menu";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

const foundationKeys = ["auth", "model", "forms", "fsd"] as const;

type HomeViewProps = {
  authState: ServerAuthState;
};

export function HomeView({ authState }: HomeViewProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const isAuthenticated = authState.status === "authenticated";

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex min-h-14 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="font-semibold" href="/">
            {tCommon("brand")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button asChild>
                  <Link href="/dashboard">{t("actions.dashboard")}</Link>
                </Button>
                <UserMenu email={authState.user.email ?? "member@example.com"} />
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/sign-in">{t("nav.signIn")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">{t("nav.createAccount")}</Link>
                </Button>
              </>
            )}
          </div>
        </header>
        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1fr_420px]">
          <div className="flex max-w-2xl flex-col gap-6">
            <Badge className="w-fit" variant="secondary">
              {t("badge")}
            </Badge>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
                {t("title")}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
                  {isAuthenticated ? t("actions.dashboard") : t("actions.auth")}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              {!isAuthenticated ? (
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-in">{t("nav.signIn")}</Link>
                </Button>
              ) : null}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("checklist.title")}</CardTitle>
              <CardDescription>
                {t("checklist.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {foundationKeys.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border p-3">
                  <CheckCircle2 className="text-primary" data-icon="inline-start" />
                  <span className="text-sm font-medium">
                    {t(`checklist.items.${item}`)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
