import { NextResponse, type NextRequest } from "next/server";
import { isMissingAccountStorageError } from "@/entities/usage";
import {
  createDeleteAccountSchema,
  deleteCurrentAccount,
} from "@/features/delete-account";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";
import { getClientIpFromHeaders } from "@/shared/lib/request";

const messages = {
  emailRequired: "Enter your current email to confirm account deletion.",
  emailMismatch: "The email does not match the signed-in account.",
};

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasPublicEnv()) {
    return NextResponse.json(
      { message: "Authentication is not configured." },
      { status: 503 },
    );
  }

  if (!hasAccountDeletionEnv()) {
    return NextResponse.json(
      { message: "Account deletion is not configured." },
      { status: 503 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json(
      { message: "You must be signed in to delete your account." },
      { status: 401 },
    );
  }

  const parsed = createDeleteAccountSchema(user.email, messages).safeParse(
    await readJson(request),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues.at(0)?.message ?? messages.emailMismatch },
      { status: 400 },
    );
  }

  try {
    await deleteCurrentAccount({
      user,
      ip: getClientIpFromHeaders(request.headers),
    });
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isMissingAccountStorageError(error)) {
      return NextResponse.json(
        {
          message:
            "Account deletion storage is not ready. Apply the latest Supabase migrations.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "Unable to delete account." },
      { status: 500 },
    );
  }
}
