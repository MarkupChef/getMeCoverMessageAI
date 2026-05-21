"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

type NavigationItem = {
  href: string;
  label: string;
};

type MobileNavigationMenuProps = {
  items: NavigationItem[];
};

export function MobileNavigationMenu({ items }: MobileNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        aria-label="Open navigation menu"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Menu />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="left-auto right-0 top-0 h-dvh w-[min(20rem,100vw)] translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-2">
            {items.map((item) => (
              <Button
                asChild
                className="justify-start"
                key={item.href}
                variant="ghost"
              >
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
