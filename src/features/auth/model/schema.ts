import { z } from "zod";

export type AuthValidationMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  fullNameRequired: string;
  fullNameMin: string;
  fullNameMax: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export const defaultAuthValidationMessages: AuthValidationMessages = {
  emailRequired: "Email is required.",
  emailInvalid: "Enter a valid email address.",
  passwordRequired: "Password is required.",
  passwordMin: "Password must be at least 8 characters.",
  fullNameRequired: "Full name is required.",
  fullNameMin: "Full name must be at least 2 characters.",
  fullNameMax: "Full name must be 120 characters or fewer.",
  confirmPasswordRequired: "Confirm your password.",
  passwordsMismatch: "Passwords do not match.",
};

export function createSignInSchema(messages: AuthValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(z.email(messages.emailInvalid)),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMin),
  });
}

export function createSignUpSchema(messages: AuthValidationMessages) {
  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(1, messages.fullNameRequired)
        .min(2, messages.fullNameMin)
        .max(120, messages.fullNameMax),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .pipe(z.email(messages.emailInvalid)),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin),
      confirmPassword: z
        .string()
        .min(1, messages.confirmPasswordRequired)
        .min(8, messages.passwordMin),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordsMismatch,
    });
}

export function createForgotPasswordSchema(messages: AuthValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(z.email(messages.emailInvalid)),
  });
}

export function createResetPasswordSchema(messages: AuthValidationMessages) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin),
      confirmPassword: z
        .string()
        .min(1, messages.confirmPasswordRequired)
        .min(8, messages.passwordMin),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordsMismatch,
    });
}

export function createChangePasswordSchema(messages: AuthValidationMessages) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin),
      confirmPassword: z
        .string()
        .min(1, messages.confirmPasswordRequired)
        .min(8, messages.passwordMin),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordsMismatch,
    });
}

export const signInSchema = createSignInSchema(defaultAuthValidationMessages);
export const signUpSchema = createSignUpSchema(defaultAuthValidationMessages);
export const forgotPasswordSchema = createForgotPasswordSchema(
  defaultAuthValidationMessages,
);
export const resetPasswordSchema = createResetPasswordSchema(
  defaultAuthValidationMessages,
);
export const changePasswordSchema = createChangePasswordSchema(
  defaultAuthValidationMessages,
);

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
