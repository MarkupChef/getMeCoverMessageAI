import { z } from "zod";

export const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export const membershipSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  userId: z.uuid(),
  role: membershipRoleSchema,
});

export type MembershipRole = z.infer<typeof membershipRoleSchema>;
export type Membership = z.infer<typeof membershipSchema>;
