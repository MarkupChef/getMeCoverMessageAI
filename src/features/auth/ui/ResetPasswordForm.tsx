"use client";

import { useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { resetPasswordAction } from "../api/actions";
import { createResetPasswordSchema, type ResetPasswordInput } from "../model/schema";

export function ResetPasswordForm() {
  const tActions = useTranslations("auth.actions");
  const tFields = useTranslations("auth.fields");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        emailRequired: tValidation("emailRequired"),
        emailInvalid: tValidation("emailInvalid"),
        passwordRequired: tValidation("passwordRequired"),
        passwordMin: tValidation("passwordMin"),
        fullNameRequired: tValidation("fullNameRequired"),
        fullNameMin: tValidation("fullNameMin"),
        fullNameMax: tValidation("fullNameMax"),
        confirmPasswordRequired: tValidation("confirmPasswordRequired"),
        passwordsMismatch: tValidation("passwordsMismatch"),
      }),
    [tValidation],
  );
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (!result.ok) {
        toast.error(result.message ?? tMessages("unableUpdatePassword"));
      }
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <Label htmlFor="password">{tFields("newPassword")}</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
          <Label htmlFor="confirmPassword">{tFields("confirmNewPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {tActions("updatePassword")}
      </Button>
    </form>
  );
}
