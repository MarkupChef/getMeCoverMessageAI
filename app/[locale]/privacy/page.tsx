import { getServerAuthState } from "@/entities/session";
import { PrivacyView } from "@/views/privacy";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const authState = await getServerAuthState();

  return <PrivacyView authState={authState} />;
}
