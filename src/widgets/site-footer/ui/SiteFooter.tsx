import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/language-switcher";
import { Link } from "@/shared/i18n";

export function SiteFooter() {
  const t = useTranslations("siteFooter");

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link className="hover:text-foreground" href="/privacy">
            {t("privacy")}
          </Link>
          <Link className="hover:text-foreground" href="/terms">
            {t("terms")}
          </Link>
          <span>
            {t("contact")}: {t("email")}
          </span>
        </nav>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
