"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { changePasswordAction } from "../api/actions";
import {
  createChangePasswordSchema,
  type ChangePasswordInput,
} from "../model/schema";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
};

type PasswordFieldName = keyof ChangePasswordInput;

type PasswordFieldProps = {
  autoComplete: string;
  disabled: boolean;
  error?: string;
  id: string;
  label: string;
  name: PasswordFieldName;
  register: ReturnType<typeof useForm<ChangePasswordInput>>["register"];
  toggleLabel: string;
};

function PasswordField({
  autoComplete,
  disabled,
  error,
  id,
  label,
  name,
  register,
  toggleLabel,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Field data-invalid={Boolean(error)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          autoComplete={autoComplete}
          className="pr-10"
          type={isVisible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          {...register(name)}
        />
        <Button
          aria-label={toggleLabel}
          className="absolute right-0 top-0 h-10 w-10"
          disabled={disabled}
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const tActions = useTranslations("auth.actions");
  const tFields = useTranslations("auth.fields");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(
    () =>
      createChangePasswordSchema({
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
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting || isPending;
  const passwordToggleLabel = tActions("togglePasswordVisibility");

  function onSubmit(values: ChangePasswordInput) {
    startTransition(async () => {
      const result = await changePasswordAction(values);

      if (result.ok) {
        form.reset();
        onSuccess?.();
        return;
      }

      toast.error(result.message ?? tMessages("unableUpdatePassword"));
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
        <PasswordField
          id="currentPassword"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={form.formState.errors.currentPassword?.message}
          label={tFields("currentPassword")}
          name="currentPassword"
          register={form.register}
          toggleLabel={passwordToggleLabel}
        />
        <PasswordField
          id="newPassword"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.password?.message}
          label={tFields("newPassword")}
          name="password"
          register={form.register}
          toggleLabel={passwordToggleLabel}
        />
        <PasswordField
          id="confirmNewPassword"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.confirmPassword?.message}
          label={tFields("confirmNewPassword")}
          name="confirmPassword"
          register={form.register}
          toggleLabel={passwordToggleLabel}
        />
      </FieldGroup>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        {tActions("updatePassword")}
      </Button>
    </form>
  );
}
