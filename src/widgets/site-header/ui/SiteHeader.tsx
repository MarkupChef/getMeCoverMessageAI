import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/language-switcher";
import { ThemeToggle } from "@/features/theme-toggle";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";

type SiteHeaderProps = {
  isAuthenticated: boolean;
  showAuthAction?: boolean;
  userMenu?: ReactNode;
};

export function SiteHeader({
  isAuthenticated,
  showAuthAction = true,
  userMenu,
}: SiteHeaderProps) {
  const tCommon = useTranslations("common");
  const tHeader = useTranslations("siteHeader");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link className="text-base font-semibold" href="/">
          {tCommon("brand")}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2">
          {isAuthenticated ? (
            <Button asChild variant="ghost">
              <Link href="/results">{tHeader("results")}</Link>
            </Button>
          ) : null}
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            userMenu
          ) : showAuthAction ? (
            <Button asChild>
              <Link href="/sign-in">{tHeader("signIn")}</Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
