"use client";

import { Building2, ChevronDown } from "lucide-react";
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

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-between" variant="outline">
          <span className="inline-flex min-w-0 items-center gap-2">
            <Building2 data-icon="inline-start" />
            <span className="truncate">Acme Workspace</span>
          </span>
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Acme Workspace</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Create organization</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
