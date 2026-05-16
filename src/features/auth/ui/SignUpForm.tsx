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
import { signUpAction } from "../api/actions";
import { createSignUpSchema, type SignUpInput } from "../model/schema";

export function SignUpForm() {
  const tActions = useTranslations("auth.actions");
  const tFields = useTranslations("auth.fields");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createSignUpSchema({
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
  const form = useForm<SignUpInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting || isPending;

  function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const result = await signUpAction(values);
      if (result.ok) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message ?? tMessages("unableCreateAccount"));
      }
    });
  }

  return (
    <form
      className="flex flex-col gap-4"
      method="post"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.fullName)}>
          <Label htmlFor="fullName">{tFields("fullName")}</Label>
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={Boolean(form.formState.errors.fullName)}
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName ? (
            <FieldError>{form.formState.errors.fullName.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <Label htmlFor="email">{tFields("email")}</Label>
          <Input
            id="email"
            autoComplete="email"
            type="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <Label htmlFor="password">{tFields("password")}</Label>
          <Input
            id="password"
            autoComplete="new-password"
            type="password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
          <Label htmlFor="confirmPassword">{tFields("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            autoComplete="new-password"
            type="password"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        {tActions("createAccount")}
      </Button>
    </form>
  );
}
