import Link from "next/link";
import { BarChart3, CreditCard, Home, Settings, Users } from "lucide-react";
import { OrganizationSwitcher } from "@/features/organization-switcher";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Members", icon: Users },
  { href: "/settings", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 border-r bg-sidebar p-4 lg:flex lg:flex-col",
        className,
      )}
    >
      <div className="flex h-12 items-center px-2 text-lg font-semibold">
        SaaS Starter
      </div>
      <div className="mt-4">
        <OrganizationSwitcher />
      </div>
      <Separator className="my-4" />
      <nav className="flex flex-col gap-1">
        {navigation.map((item) => (
          <Button
            key={item.label}
            asChild
            className="justify-start"
            variant="ghost"
          >
            <Link href={item.href}>
              <item.icon data-icon="inline-start" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
