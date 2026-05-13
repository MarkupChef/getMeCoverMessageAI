"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { resetPasswordAction } from "../api/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "../model/schema";

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (!result.ok) {
        toast.error(result.message ?? "Unable to update password.");
      }
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
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
        Update password
      </Button>
    </form>
  );
}
