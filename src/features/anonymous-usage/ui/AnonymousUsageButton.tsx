"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { AnonymousUsageResult } from "@/entities/usage";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { consumeAnonymousUsageLimitAction } from "../api/actions";

type AnonymousUsageButtonState =
  | {
      status: "idle";
    }
  | AnonymousUsageResult
  | {
      status: "error";
    };

async function getFingerprintVisitorId() {
  const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
  const agent = await FingerprintJS.load();
  const result = await agent.get();

  return result.visitorId;
}

function getStatusText(
  state: AnonymousUsageButtonState,
  t: ReturnType<typeof useTranslations>,
) {
  if (state.status === "consumed") {
    return t("remaining", { remaining: String(state.remaining) });
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
  const [state, setState] = useState<AnonymousUsageButtonState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const statusText = getStatusText(state, t);

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

  function consumeLimit() {
    startTransition(async () => {
      try {
        const deviceId = await getFingerprintVisitorId();
        const result = await consumeAnonymousUsageLimitAction({ deviceId });
        setState(result);
      } catch {
        setState({ status: "error" });
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        className="w-fit"
        disabled={isPending}
        onClick={consumeLimit}
        size="lg"
        type="button"
      >
        {isPending ? (
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
