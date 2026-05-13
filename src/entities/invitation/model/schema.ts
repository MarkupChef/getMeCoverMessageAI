import { z } from "zod";

export const invitationStatusSchema = z.enum([
  "pending",
  "accepted",
  "revoked",
  "expired",
]);

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]).default("member"),
});

export type InvitationStatus = z.infer<typeof invitationStatusSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
