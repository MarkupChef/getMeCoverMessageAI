import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email address.")),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(120, "Full name must be 120 characters or fewer."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .pipe(z.email("Enter a valid email address.")),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(1, "Confirm your password.")
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email address.")),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(1, "Confirm your password.")
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
