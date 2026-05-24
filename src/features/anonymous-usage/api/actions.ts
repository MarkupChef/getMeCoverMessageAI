"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import {
  ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS,
  consumeAnonymousFreeGeneration,
  getAnonymousFreeGenerationSnapshot,
  isRecoverableUsageInitializationError,
  type AnonymousUsageResult,
  type AnonymousUsageSnapshot,
} from "@/entities/usage";
import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";
import { getClientIpFromHeaders } from "@/shared/lib/request";

const anonymousUsageInputSchema = z.object({
  deviceId: z.string().min(1).max(512).nullable().optional(),
});

const anonymousCookieName = "cmai_anonymous_id";
const anonymousCookieMaxAge =
  ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS * 24 * 60 * 60;

type AnonymousCookieState = {
  anonymousId: string;
  shouldSetCookie: boolean;
};

function getAnonymousCookieState(cookieValue: string | undefined): AnonymousCookieState {
  const parsedCookie = z.uuid().safeParse(cookieValue);

  if (parsedCookie.success) {
    return {
      anonymousId: parsedCookie.data,
      shouldSetCookie: false,
    };
  }

  return {
    anonymousId: randomUUID(),
    shouldSetCookie: true,
  };
}

function setAnonymousCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, value: string) {
  cookieStore.set({
    name: anonymousCookieName,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: anonymousCookieMaxAge,
  });
}

export async function consumeAnonymousUsageLimitAction(
  input: unknown,
): Promise<AnonymousUsageResult> {
  const parsed = anonymousUsageInputSchema.safeParse(input);

  if (!parsed.success || !hasAccountDeletionEnv()) {
    return { status: "unavailable" };
  }

  try {
    const cookieStore = await cookies();
    const cookieState = getAnonymousCookieState(
      cookieStore.get(anonymousCookieName)?.value,
    );
    const result = await consumeAnonymousFreeGeneration({
      anonymousId: cookieState.anonymousId,
      deviceId: parsed.data.deviceId ?? null,
      ip: getClientIpFromHeaders(await headers()),
      client: createSupabaseAdminClient(),
    });

    if (cookieState.shouldSetCookie) {
      setAnonymousCookie(cookieStore, cookieState.anonymousId);
    }

    return result;
  } catch (error) {
    if (isRecoverableUsageInitializationError(error)) {
      console.error("Anonymous usage storage is not ready.", error);
      return { status: "unavailable" };
    }

    throw error;
  }
}

export async function getAnonymousUsageLimitAction(
  input: unknown,
): Promise<AnonymousUsageSnapshot> {
  const parsed = anonymousUsageInputSchema.safeParse(input);

  if (!parsed.success || !hasAccountDeletionEnv()) {
    return { status: "unavailable" };
  }

  try {
    const cookieStore = await cookies();
    const cookieState = getAnonymousCookieState(
      cookieStore.get(anonymousCookieName)?.value,
    );
    const result = await getAnonymousFreeGenerationSnapshot({
      anonymousId: cookieState.anonymousId,
      deviceId: parsed.data.deviceId ?? null,
      ip: getClientIpFromHeaders(await headers()),
      client: createSupabaseAdminClient(),
    });

    if (cookieState.shouldSetCookie) {
      setAnonymousCookie(cookieStore, cookieState.anonymousId);
    }

    return result;
  } catch (error) {
    if (isRecoverableUsageInitializationError(error)) {
      console.error("Anonymous usage storage is not ready.", error);
      return { status: "unavailable" };
    }

    throw error;
  }
}
