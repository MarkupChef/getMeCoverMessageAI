"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  localeLabels,
  routing,
  usePathname,
  useRouter,
  type Locale,
} from "@/shared/i18n";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");

  function handleLocaleChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label className="flex h-10 items-center gap-2 rounded-md border bg-background px-3 text-sm">
      <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      <select
        aria-label={t("language")}
        className="bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
        value={locale}
        onChange={(event) => handleLocaleChange(event.target.value as Locale)}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
