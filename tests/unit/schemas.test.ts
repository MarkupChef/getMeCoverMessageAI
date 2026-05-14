import { describe, expect, it } from "vitest";
import { subscriptionStatusSchema } from "@/entities/billing";
import { signInSchema, signUpSchema } from "@/features/auth";

describe("validation schemas", () => {
  it("rejects invalid sign in credentials", () => {
    expect(
      signInSchema.safeParse({ email: "bad", password: "short" }).success,
    ).toBe(false);
  });

  it("accepts valid sign up input", () => {
    expect(
      signUpSchema.safeParse({
        fullName: "Jane Founder",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
      }).success,
    ).toBe(true);
  });

  it("rejects mismatched sign up passwords", () => {
    expect(
      signUpSchema.safeParse({
        fullName: "Jane Founder",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password456",
      }).success,
    ).toBe(false);
  });

  it("validates subscription statuses", () => {
    expect(subscriptionStatusSchema.safeParse("active").success).toBe(true);
    expect(subscriptionStatusSchema.safeParse("paused").success).toBe(false);
  });
});
