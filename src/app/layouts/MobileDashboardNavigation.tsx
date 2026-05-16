"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

export function MobileDashboardNavigation() {
  const t = useTranslations("dashboard.shell");
  const tCommon = useTranslations("common");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" size="icon" type="button" variant="ghost">
          <Menu />
          <span className="sr-only">{t("openNavigation")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0" aria-describedby={undefined}>
        <SheetHeader className="sr-only">
          <SheetTitle>{t("navigation")}</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col p-4">
          <Link
            className="flex h-12 items-center px-2 text-lg font-semibold"
            href="/dashboard"
          >
            {tCommon("brand")}
          </Link>
          <Separator className="my-4" />
          <DashboardSidebar className="flex w-full border-r-0 bg-background p-0 lg:flex" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
