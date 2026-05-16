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
import { forgotPasswordAction } from "../api/actions";
import {
  createForgotPasswordSchema,
  type ForgotPasswordInput,
} from "../model/schema";

export function ForgotPasswordForm() {
  const tActions = useTranslations("auth.actions");
  const tFields = useTranslations("auth.fields");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
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
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(schema),
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
        toast.error(result.message ?? tMessages("unableSendResetEmail"));
      }
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <Label htmlFor="email">{tFields("email")}</Label>
          <Input id="email" autoComplete="email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {tActions("sendResetLink")}
      </Button>
    </form>
  );
}
