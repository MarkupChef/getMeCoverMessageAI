import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "@/features/auth";
import { inviteMemberSchema } from "@/features/invitation-management";
import { organizationSchema } from "@/entities/organization";

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

  it("validates organization slugs", () => {
    expect(
      organizationSchema.safeParse({ name: "Acme", slug: "acme-workspace" })
        .success,
    ).toBe(true);
    expect(
      organizationSchema.safeParse({ name: "Acme", slug: "Acme Workspace" })
        .success,
    ).toBe(false);
  });

  it("defaults invitation role to member", () => {
    const result = inviteMemberSchema.parse({ email: "new@example.com" });

    expect(result.role).toBe("member");
  });
});
