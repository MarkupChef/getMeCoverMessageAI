"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { useAnonymousUsage } from "../model/anonymous-usage-state";

export function AnonymousUsageButton() {
  const t = useTranslations("anonymousUsage");
  const { consume, isConsuming, state } = useAnonymousUsage();

  if (state.status === "exhausted") {
    return (
      <Button asChild className="w-fit" size="lg">
        <Link href="/pricing">
          {t("upgrade")}
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    );
  }

  if (state.status === "signup_required") {
    return (
      <Button asChild className="w-fit" size="lg">
        <Link href="/sign-up">
          {t("createAccount")}
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
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
    </div>
  );
}
