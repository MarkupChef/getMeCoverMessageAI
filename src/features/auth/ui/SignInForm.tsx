"use client";

import { useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import {
  signInAction,
  signInWithGoogleAction,
} from "../api/actions";
import { signInSchema, type SignInInput } from "../model/schema";

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignInInput) {
    startTransition(async () => {
      const result = await signInAction(values);
      if (!result.ok) {
        toast.error(result.message ?? "Unable to sign in.");
      }
    });
  }

  function onGoogle() {
    startTransition(async () => {
      const result = await signInWithGoogleAction();
      if (!result.ok) {
        toast.error(result.message ?? "Unable to sign in with Google.");
      }
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/forgot-password"
            >
              Forgot password?
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
      <Button disabled={isPending} type="submit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Sign in
      </Button>
      <Button disabled={isPending} type="button" variant="outline" onClick={onGoogle}>
        <LogIn data-icon="inline-start" />
        Continue with Google
      </Button>
    </form>
  );
}
