"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const initials = email.slice(0, 2).toUpperCase();

  function handleSignOut() {
    startSignOutTransition(async () => {
      await fetch("/auth/sign-out", {
        method: "POST",
      });

      router.replace("/sign-in");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-10 rounded-full" variant="ghost">
          <Avatar className="size-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="sr-only">{email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User data-icon="inline-start" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings data-icon="inline-start" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onSelect={(event) => {
            event.preventDefault();
            handleSignOut();
          }}
        >
          <LogOut data-icon="inline-start" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
