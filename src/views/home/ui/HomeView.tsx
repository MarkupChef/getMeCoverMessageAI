import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { ServerAuthState } from "@/entities/session";
import { AnonymousUsageButton } from "@/features/anonymous-usage";
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
  "anonymousUsageLimits",
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
type StackKey = (typeof stackKeys)[number];
type BrandLogoProps = {
  className?: string;
};

function NextLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#000000" />
      <path d="M13 27V13h3.2l10.7 14H23.8L15.9 16.8V27H13Z" fill="#ffffff" />
      <path d="M24.4 13h2.8v14h-2.8V13Z" fill="#ffffff" />
    </svg>
  );
}

function ReactLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="3.5" fill="#61DAFB" />
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="5.8"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="2"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="5.8"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="2"
        transform="rotate(60 20 20)"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="5.8"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="2"
        transform="rotate(120 20 20)"
      />
    </svg>
  );
}

function TypeScriptLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="6" fill="#3178C6" />
      <path d="M8 16h14v3h-5v14h-4V19H8v-3Z" fill="#ffffff" />
      <path
        d="M24.5 32.5c-2 0-3.8-.5-5.2-1.4v-4c1.4 1.1 3.2 1.8 5.2 1.8 1.5 0 2.3-.5 2.3-1.4 0-.5-.2-.9-.7-1.2-.5-.3-1.4-.7-2.7-1.1-2.8-.9-4.2-2.4-4.2-4.7 0-1.6.6-2.8 1.8-3.7 1.2-.9 2.8-1.3 4.7-1.3 1.7 0 3.2.4 4.5 1.1v3.8c-1.2-.8-2.7-1.3-4.4-1.3-1.4 0-2.1.4-2.1 1.3 0 .5.2.8.7 1.1.5.3 1.3.6 2.5 1 1.5.5 2.6 1.1 3.3 1.9.7.8 1.1 1.8 1.1 3 0 1.6-.6 2.9-1.8 3.8-1.2.9-2.9 1.3-5 1.3Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function TailwindLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 12c-4.5 0-7.3 2.2-8.5 6.6 1.7-2.2 3.7-3 6.1-2.3 1.3.4 2.3 1.4 3.4 2.4 1.8 1.8 3.9 3.8 8.5 3.8 4.5 0 7.3-2.2 8.5-6.6-1.7 2.2-3.7 3-6.1 2.3-1.3-.4-2.3-1.4-3.4-2.4C26.7 14 24.6 12 20 12ZM10.5 22.5c-4.5 0-7.3 2.2-8.5 6.6 1.7-2.2 3.7-3 6.1-2.3 1.3.4 2.3 1.4 3.4 2.4 1.8 1.8 3.9 3.8 8.5 3.8 4.5 0 7.3-2.2 8.5-6.6-1.7 2.2-3.7 3-6.1 2.3-1.3-.4-2.3-1.4-3.4-2.4-1.8-1.8-3.9-3.8-8.5-3.8Z"
        fill="#06B6D4"
      />
    </svg>
  );
}

function ShadcnLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#09090B" />
      <path d="M26.8 9.8 9.8 26.8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M30.2 19.2 19.2 30.2" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SupabaseLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M21.8 37c-.7.9-2.1.4-2.1-.8V22H10c-1.3 0-2-1.5-1.2-2.5L18.2 3c.7-1 2.1-.5 2.1.7V18H30c1.3 0 2 1.5 1.2 2.5L21.8 37Z"
        fill="#3ECF8E"
      />
      <path d="M20.3 18h9.8c1.3 0 2 1.5 1.2 2.5L21.8 37c-.7.9-2.1.4-2.1-.8V22h-9.8c-1.3 0-2-1.5-1.2-2.5L18.2 3c.7-1 2.1-.5 2.1.7V18Z" fill="#3ECF8E" />
      <path d="M20.3 18H10c-1.3 0-2-1.5-1.2-2.5L18.2 3c.7-1 2.1-.5 2.1.7V18Z" fill="#3ECF8E" opacity=".65" />
    </svg>
  );
}

function ZodLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#274D82" />
      <path d="M10 11h20v5L17 29h13v5H10v-5l13-13H10v-5Z" fill="#ffffff" />
      <path d="M12.5 13.5h15v1.8L14.5 28.2v3.3h-2v-4.1l13-12.9h-13v-1Z" fill="#7DD3FC" opacity=".75" />
    </svg>
  );
}

function ReactHookFormLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#EC5990" />
      <path d="M12 11h16v18H12V11Z" fill="#ffffff" opacity=".18" />
      <path d="M15 16h10M15 21h10M15 26h6" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M28 28.5 31.5 32 36 25" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TanStackLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="7" width="28" height="7" rx="2" fill="#FF4154" />
      <rect x="10" y="17" width="20" height="7" rx="2" fill="#FFB020" />
      <rect x="14" y="27" width="12" height="7" rx="2" fill="#00D084" />
    </svg>
  );
}

function NextThemesLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#111827" />
      <path
        d="M27.8 27.2A11 11 0 0 1 12.8 12.2a9.5 9.5 0 1 0 15 15Z"
        fill="#FBBF24"
      />
      <circle cx="27" cy="12" r="2.2" fill="#F8FAFC" />
      <circle cx="31.5" cy="17.5" r="1.4" fill="#F8FAFC" />
    </svg>
  );
}

function NextIntlLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="#2563EB" />
      <path d="M5 20h30M20 5c4.5 4.5 6.8 9.5 6.8 15S24.5 30.5 20 35M20 5c-4.5 4.5-6.8 9.5-6.8 15S15.5 30.5 20 35" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M10 12.5h20M10 27.5h20" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function VitestPlaywrightLogo({ className }: BrandLogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#111827" />
      <path d="M10 10h9l-4.5 8L10 10Z" fill="#FCC72B" />
      <path d="M21 10h9l-4.5 8L21 10Z" fill="#45BA4B" />
      <path d="M12 20h16l-8 12-8-12Z" fill="#729B1B" />
      <circle cx="15" cy="15" r="1.3" fill="#111827" />
      <circle cx="26" cy="15" r="1.3" fill="#111827" />
    </svg>
  );
}

const stackIcons: Record<StackKey, (props: BrandLogoProps) => ReactNode> = {
  next: NextLogo,
  react: ReactLogo,
  typescript: TypeScriptLogo,
  tailwind: TailwindLogo,
  ui: ShadcnLogo,
  supabase: SupabaseLogo,
  zod: ZodLogo,
  forms: ReactHookFormLogo,
  query: TanStackLogo,
  theme: NextThemesLogo,
  i18n: NextIntlLogo,
  testing: VitestPlaywrightLogo,
};

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
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="w-fit" size="lg">
                <Link href={isAuthenticated ? "/results" : "/sign-up"}>
                  {isAuthenticated ? t("actions.results") : t("actions.auth")}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
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
              {isAuthenticated ? null : (
                <div className="mt-2 flex justify-center">
                  <AnonymousUsageButton />
                </div>
              )}
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
                  <CheckCircle2
                    className="text-emerald-600 dark:text-emerald-400"
                    data-icon="inline-start"
                  />
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
              {stackKeys.map((item) => {
                const StackIcon = stackIcons[item];

                return (
                  <div key={item} className="rounded-md border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
                        <StackIcon
                          className="size-7"
                        />
                      </span>
                      <h3 className="font-medium">
                        {t(`stack.items.${item}.title`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {t(`stack.items.${item}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
