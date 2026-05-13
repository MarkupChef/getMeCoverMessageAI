import { z } from "zod";

export const subscriptionStatusSchema = z.enum([
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
]);

export const billingProviderSchema = z.enum(["stripe"]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type BillingProvider = z.infer<typeof billingProviderSchema>;
