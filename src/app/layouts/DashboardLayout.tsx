import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/features/theme-toggle";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { UserMenu } from "@/widgets/user-menu";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

export function DashboardLayout({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="ghost">
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
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">
              Production-ready SaaS foundation
            </p>
          </div>
          <ThemeToggle />
          <UserMenu email={userEmail} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
