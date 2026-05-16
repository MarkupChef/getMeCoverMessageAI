import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/language-switcher";
import { ThemeToggle } from "@/features/theme-toggle";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { UserMenu } from "@/widgets/user-menu";
import { MobileDashboardNavigation } from "./MobileDashboardNavigation";

export function DashboardLayout({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const t = useTranslations("dashboard.shell");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <MobileDashboardNavigation />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu email={userEmail} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
