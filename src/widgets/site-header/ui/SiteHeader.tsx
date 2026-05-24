import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnonymousUsageCounter } from "@/features/anonymous-usage";
import { ThemeToggle } from "@/features/theme-toggle";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { MobileNavigationMenu } from "./MobileNavigationMenu";

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
  const navigationItems = isAuthenticated
    ? [
        { href: "/results", label: tHeader("results") },
        { href: "/plan", label: tHeader("plan") },
      ]
    : [{ href: "/pricing", label: tHeader("pricing") }];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link className="text-base font-semibold" href="/">
          {tCommon("brand")}
        </Link>
        <div className="flex items-center justify-end gap-2">
          <nav className="hidden items-center justify-end gap-2 md:flex">
            {navigationItems.map((item) => (
              <Button asChild key={item.href} variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <ThemeToggle />
          {isAuthenticated ? (
            userMenu
          ) : showAuthAction ? (
            <>
              <AnonymousUsageCounter />
              <Button asChild>
                <Link href="/sign-in">{tHeader("signIn")}</Link>
              </Button>
            </>
          ) : null}
          <MobileNavigationMenu items={navigationItems} />
        </div>
      </div>
    </header>
  );
}
