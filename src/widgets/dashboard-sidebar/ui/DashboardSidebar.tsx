import { BarChart3, CreditCard, Home, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

const navigation = [
  { href: "/dashboard", labelKey: "overview", icon: Home },
  { href: "/dashboard", labelKey: "analytics", icon: BarChart3 },
  { href: "/settings", labelKey: "billing", icon: CreditCard },
  { href: "/settings", labelKey: "settings", icon: Settings },
] as const;

export function DashboardSidebar({ className }: { className?: string }) {
  const t = useTranslations("dashboard.sidebar");
  const tCommon = useTranslations("common");

  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 border-r bg-sidebar p-4 lg:flex lg:flex-col",
        className,
      )}
    >
      <div className="flex h-12 items-center px-2 text-lg font-semibold">
        {tCommon("brand")}
      </div>
      <Separator className="my-4" />
      <nav className="flex flex-col gap-1">
        {navigation.map((item) => (
          <Button
            key={item.labelKey}
            asChild
            className="justify-start"
            variant="ghost"
          >
            <Link href={item.href}>
              <item.icon data-icon="inline-start" />
              {t(item.labelKey)}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
