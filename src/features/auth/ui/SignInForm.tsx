"use client";

import { useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getLocalizedPath, Link, type Locale } from "@/shared/i18n";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { signInAction } from "../api/actions";
import { createSignInSchema, type SignInInput } from "../model/schema";

type SignInFormProps = {
  oauthError?: string;
};

export function SignInForm({ oauthError }: SignInFormProps) {
  const locale = useLocale() as Locale;
  const tActions = useTranslations("auth.actions");
  const tFields = useTranslations("auth.fields");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createSignInSchema({
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
  const form = useForm<SignInInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting || isPending;

  function onSubmit(values: SignInInput) {
    startTransition(async () => {
      const result = await signInAction(values);
      if (!result.ok) {
        toast.error(result.message ?? tMessages("unableSignIn"));
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {oauthError ? (
        <Alert variant="destructive">
          <AlertDescription>{oauthError}</AlertDescription>
        </Alert>
      ) : null}
      <form
        className="flex flex-col gap-4"
        method="post"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
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
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">{tFields("password")}</Label>
              <Link
                className="text-sm text-muted-foreground hover:text-foreground"
                href="/forgot-password"
              >
                {tActions("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              autoComplete="current-password"
              type="password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            ) : null}
          </Field>
        </FieldGroup>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          {tActions("signIn")}
        </Button>
      </form>
      <form action={getLocalizedPath(locale, "/auth/google")} method="post">
        <Button className="w-full" type="submit" variant="outline">
          <LogIn data-icon="inline-start" />
          {tActions("continueWithGoogle")}
        </Button>
      </form>
    </div>
  );
}
