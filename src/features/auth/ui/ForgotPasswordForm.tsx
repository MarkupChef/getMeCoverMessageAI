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
import { forgotPasswordAction } from "../api/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../model/schema";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await forgotPasswordAction(values);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message ?? "Unable to send reset email.");
      }
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" autoComplete="email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Send reset link
      </Button>
    </form>
  );
}
