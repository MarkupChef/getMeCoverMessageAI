"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" size="icon" type="button" variant="ghost">
          <Menu />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0" aria-describedby={undefined}>
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col p-4">
          <Link
            className="flex h-12 items-center px-2 text-lg font-semibold"
            href="/dashboard"
          >
            SaaS Starter
          </Link>
          <Separator className="my-4" />
          <DashboardSidebar className="flex w-full border-r-0 bg-background p-0 lg:flex" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
