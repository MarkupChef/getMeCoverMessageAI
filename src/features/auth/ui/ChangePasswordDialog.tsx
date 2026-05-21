"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ChangePasswordForm } from "./ChangePasswordForm";

export function ChangePasswordDialog() {
  const tActions = useTranslations("auth.actions");
  const tDialog = useTranslations("auth.passwordDialog");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      setIsSuccess(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <KeyRound data-icon="inline-start" />
          {tActions("changePassword")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isSuccess ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
              </div>
              <DialogTitle>{tDialog("successTitle")}</DialogTitle>
              <DialogDescription>
                {tDialog("successDescription")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">{tActions("close")}</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{tDialog("title")}</DialogTitle>
              <DialogDescription className="sr-only">
                {tDialog("description")}
              </DialogDescription>
            </DialogHeader>
            <ChangePasswordForm onSuccess={() => setIsSuccess(true)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
