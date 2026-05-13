import { z } from "zod";

export const profileSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1).max(120).nullable(),
  avatarUrl: z.url().nullable(),
});

export type Profile = z.infer<typeof profileSchema>;
