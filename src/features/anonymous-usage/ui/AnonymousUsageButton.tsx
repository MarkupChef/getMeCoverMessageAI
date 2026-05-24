"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { useAnonymousUsage } from "../model/anonymous-usage-state";

function getStatusText(
  state: ReturnType<typeof useAnonymousUsage>["state"],
  t: ReturnType<typeof useTranslations>,
) {
  if (state.status === "available" && state.used > 0) {
    return t("remaining", { remaining: state.remaining });
  }

  if (state.status === "exhausted") {
    return t("exhausted");
  }

  if (state.status === "signup_required") {
    return t("signupRequired");
  }

  if (state.status === "unavailable" || state.status === "error") {
    return t("unavailable");
  }

  return null;
}

export function AnonymousUsageButton() {
  const t = useTranslations("anonymousUsage");
  const { consume, isConsuming, state } = useAnonymousUsage();
  const statusText = getStatusText(state, t);

  if (state.status === "exhausted") {
    return (
      <div className="flex flex-col items-start gap-2">
        <Button asChild className="w-fit" size="lg">
          <Link href="/pricing">
            {t("upgrade")}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        {statusText ? (
          <p className="max-w-sm text-sm text-muted-foreground">{statusText}</p>
        ) : null}
      </div>
    );
  }

  if (state.status === "signup_required") {
    return (
      <div className="flex flex-col items-start gap-2">
        <Button asChild className="w-fit" size="lg">
          <Link href="/sign-up">
            {t("createAccount")}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        {statusText ? (
          <p className="max-w-sm text-sm text-muted-foreground">{statusText}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        className="w-fit"
        disabled={isConsuming}
        onClick={consume}
        size="lg"
        type="button"
      >
        {isConsuming ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : null}
        {t("useLimit")}
      </Button>
      {statusText ? (
        <p className="max-w-sm text-sm text-muted-foreground">{statusText}</p>
      ) : null}
    </div>
  );
}
