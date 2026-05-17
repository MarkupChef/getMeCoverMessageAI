"use client";

import { useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "@/shared/i18n";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Field, FieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import {
  createDeleteAccountSchema,
  type DeleteAccountInput,
} from "../model/schema";

export function DeleteAccountDialog({ email }: { email: string }) {
  const router = useRouter();
  const t = useTranslations("deleteAccount");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createDeleteAccountSchema(email, {
        emailRequired: t("validation.emailRequired"),
        emailMismatch: t("validation.emailMismatch"),
      }),
    [email, t],
  );
  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting || isPending;

  function onSubmit(values: DeleteAccountInput) {
    startTransition(async () => {
      form.clearErrors("root");

      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        form.setError("root", {
          message: body?.message ?? t("messages.unableDelete"),
        });
        return;
      }

      toast.success(t("messages.deleted"));
      router.replace("/sign-in");
      router.refresh();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2 data-icon="inline-start" />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          method="post"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.errors.root ? (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}
          <Field data-invalid={Boolean(form.formState.errors.email)}>
            <Label htmlFor="delete-account-email">
              {t("dialog.emailLabel")}
            </Label>
            <Input
              id="delete-account-email"
              autoComplete="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              disabled={isSubmitting}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            ) : null}
          </Field>
          <DialogFooter>
            <Button disabled={isSubmitting} type="submit" variant="destructive">
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              {t("dialog.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

