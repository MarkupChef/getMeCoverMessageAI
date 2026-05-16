"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">{t("genericTitle")}</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>{t("retry")}</Button>
      </div>
    </main>
  );
}
