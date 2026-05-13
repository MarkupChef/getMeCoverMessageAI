"use server";

import { redirect } from "next/navigation";
import { getPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "../model/schema";

export type AuthActionState = {
  ok: boolean;
  message?: string;
};

export async function signInAction(input: SignInInput): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Check your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(input: SignUpInput): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Check the submitted account details." };
  }

  const env = getPublicEnv();
  const supabase = await createSupabaseServerClient();
  const { email, password, fullName } = parsed.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: "Check your inbox to confirm your account.",
  };
}

export async function signInWithGoogleAction(): Promise<AuthActionState> {
  const env = getPublicEnv();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data.url) {
    return { ok: false, message: error?.message ?? "Unable to start Google sign in." };
  }

  redirect(data.url);
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const env = getPublicEnv();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Password reset instructions were sent." };
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Check the new password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
