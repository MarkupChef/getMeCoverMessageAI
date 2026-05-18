"use server";

import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublicEnv, hasPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { getLocalizedPath as buildLocalizedPath, type Locale } from "@/shared/i18n";
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  createSignInSchema,
  createSignUpSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "../model/schema";

export type AuthActionState = {
  ok: boolean;
  message?: string;
};

export type OAuthRedirectState = AuthActionState & {
  url?: string;
};

async function getAuthMessages() {
  const [validation, messages] = await Promise.all([
    getTranslations("auth.validation"),
    getTranslations("auth.messages"),
  ]);

  return {
    validation: {
      emailRequired: validation("emailRequired"),
      emailInvalid: validation("emailInvalid"),
      passwordRequired: validation("passwordRequired"),
      passwordMin: validation("passwordMin"),
      fullNameRequired: validation("fullNameRequired"),
      fullNameMin: validation("fullNameMin"),
      fullNameMax: validation("fullNameMax"),
      confirmPasswordRequired: validation("confirmPasswordRequired"),
      passwordsMismatch: validation("passwordsMismatch"),
    },
    messages,
  };
}

async function getCurrentLocalizedPath(pathname: `/${string}`) {
  const locale = (await getLocale()) as Locale;

  return buildLocalizedPath(locale, pathname);
}

function isDuplicateSignUpError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    code.includes("already") ||
    code.includes("exists") ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already") ||
    message.includes("email already")
  );
}

export async function signInAction(input: SignInInput): Promise<AuthActionState> {
  const { validation, messages } = await getAuthMessages();
  const parsed = createSignInSchema(validation).safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: messages("checkEmailPassword") };
  }

  if (!hasPublicEnv()) {
    return { ok: false, message: messages("authNotConfigured") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect(await getCurrentLocalizedPath("/results"));
}

export async function signUpAction(input: SignUpInput): Promise<AuthActionState> {
  const { validation, messages } = await getAuthMessages();
  const parsed = createSignUpSchema(validation).safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: messages("checkAccountDetails") };
  }

  if (!hasPublicEnv()) {
    return { ok: false, message: messages("authNotConfigured") };
  }

  const env = getPublicEnv();
  const locale = (await getLocale()) as Locale;
  const callbackPath = buildLocalizedPath(locale, "/auth/callback");
  const resultsPath = buildLocalizedPath(locale, "/results");
  const supabase = await createSupabaseServerClient();
  const { email, password, fullName } = parsed.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}${callbackPath}?next=${resultsPath}`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    if (isDuplicateSignUpError(error)) {
      return { ok: true, message: messages("confirmAccount") };
    }

    console.error("Supabase sign up failed.", {
      code: error.code,
      status: error.status,
      name: error.name,
    });

    return { ok: false, message: messages("unableCreateAccount") };
  }

  return {
    ok: true,
    message: messages("confirmAccount"),
  };
}

export async function createGoogleOAuthRedirect(): Promise<OAuthRedirectState> {
  const messages = await getTranslations("auth.messages");

  if (!hasPublicEnv()) {
    return { ok: false, message: messages("googleNotConfigured") };
  }

  const env = getPublicEnv();
  const locale = (await getLocale()) as Locale;
  const callbackPath = buildLocalizedPath(locale, "/auth/callback");
  const resultsPath = buildLocalizedPath(locale, "/results");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}${callbackPath}?next=${resultsPath}`,
    },
  });

  if (error || !data.url) {
    return { ok: false, message: error?.message ?? messages("unableGoogle") };
  }

  return { ok: true, url: data.url };
}

export async function signInWithGoogleAction(): Promise<AuthActionState> {
  const result = await createGoogleOAuthRedirect();

  if (!result.ok || !result.url) {
    return { ok: false, message: result.message };
  }

  redirect(result.url);
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<AuthActionState> {
  const { validation, messages } = await getAuthMessages();
  const parsed = createForgotPasswordSchema(validation).safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: messages("validEmail") };
  }

  const env = getPublicEnv();
  const locale = (await getLocale()) as Locale;
  const callbackPath = buildLocalizedPath(locale, "/auth/callback");
  const resetPasswordPath = buildLocalizedPath(locale, "/reset-password");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}${callbackPath}?next=${resetPasswordPath}`,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: messages("resetInstructions") };
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<AuthActionState> {
  const { validation, messages } = await getAuthMessages();
  const parsed = createResetPasswordSchema(validation).safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: messages("checkNewPassword") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect(await getCurrentLocalizedPath("/results"));
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(await getCurrentLocalizedPath("/sign-in"));
}
