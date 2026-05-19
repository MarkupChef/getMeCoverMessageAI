import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServerAuthState } from "@/entities/session";
import { SiteHeader } from "@/widgets/site-header";
import { UserMenu } from "@/widgets/user-menu";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const plans = [
  {
    key: "free",
    nameKey: "plans.free.name",
    priceKey: "plans.free.price",
    actionKey: "plans.free.action",
    features: [
      "plans.free.features.backgroundRemoval",
      "plans.free.features.upscale",
      "plans.free.features.export",
    ],
  },
  {
    key: "pro",
    nameKey: "plans.pro.name",
    priceKey: "plans.pro.price",
    actionKey: "plans.pro.action",
    features: [
      "plans.pro.features.credits",
      "plans.pro.features.models",
      "plans.pro.features.backgroundRemoval",
      "plans.pro.features.upscale",
      "plans.pro.features.team",
      "plans.pro.features.batchExports",
      "plans.pro.features.license",
    ],
  },
] as const;

type PricingViewProps = {
  mode: "public" | "account";
  authState?: ServerAuthState;
};

export function PricingView({ mode, authState }: PricingViewProps) {
  const t = useTranslations("pricing");
  const isPublic = mode === "public";
  const isAuthenticated = authState?.status === "authenticated";

  const content = (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">
          {t(isPublic ? "publicTitle" : "accountTitle")}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {plans.map((plan) => {
          const isPro = plan.key === "pro";
          const proAccountPlaceholder = !isPublic && isPro;

          return (
            <Card
              key={plan.key}
              className="flex min-h-[360px] flex-col rounded-lg"
            >
              <CardHeader className="gap-4">
                <CardTitle>{t(plan.nameKey)}</CardTitle>
                <div className="flex flex-col gap-1">
                  <div className="text-4xl font-semibold tracking-normal">
                    {t(plan.priceKey)}
                  </div>
                  <div className="text-muted-foreground">{t("period")}</div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                {isPublic ? (
                  <Button
                    asChild
                    className="w-full"
                    variant={isPro ? "default" : "outline"}
                  >
                    <Link href="/sign-up">{t(plan.actionKey)}</Link>
                  </Button>
                ) : proAccountPlaceholder ? (
                  <Button className="w-full" disabled>
                    {t(plan.actionKey)}
                  </Button>
                ) : (
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/results">{t(plan.actionKey)}</Link>
                  </Button>
                )}
                <ul className="flex flex-col gap-2 text-sm sm:text-base">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-foreground"
                      />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {proAccountPlaceholder ? (
                <CardFooter className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {t("stripePlaceholder")}
                  </p>
                </CardFooter>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );

  if (!isPublic) {
    return content;
  }

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
      <main>{content}</main>
    </div>
  );
}
