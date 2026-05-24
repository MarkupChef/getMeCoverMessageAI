"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { useAnonymousUsage } from "../model/anonymous-usage-state";

function getRemainingCredits(state: ReturnType<typeof useAnonymousUsage>["state"]) {
  if (state.status === "available" || state.status === "exhausted") {
    return state.remaining;
  }

  if (state.status === "signup_required") {
    return 0;
  }

  return null;
}

export function AnonymousUsageCounter() {
  const t = useTranslations("siteHeader");
  const { initialize, state } = useAnonymousUsage();
  const remainingCredits = getRemainingCredits(state);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (remainingCredits === null) {
    return (
      <Badge
        aria-label={t("freeCreditsUnavailable")}
        title={t("freeCreditsUnavailable")}
        variant="secondary"
      >
        {t("freeCreditsUnavailable")}
      </Badge>
    );
  }

  const label = t("freeCredits", { count: remainingCredits });

  return (
    <Badge aria-label={label} title={label} variant="secondary">
      {label}
    </Badge>
  );
}
