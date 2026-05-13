import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
