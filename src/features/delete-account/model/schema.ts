import { z } from "zod";

type DeleteAccountMessages = {
  emailRequired: string;
  emailMismatch: string;
};

export function createDeleteAccountSchema(
  currentEmail: string,
  messages: DeleteAccountMessages,
) {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .refine((value) => value === currentEmail, messages.emailMismatch),
  });
}

export type DeleteAccountInput = z.infer<
  ReturnType<typeof createDeleteAccountSchema>
>;

