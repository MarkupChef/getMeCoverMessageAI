import { getServerAuthState } from "@/entities/session";
import { TermsView } from "@/views/terms";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const authState = await getServerAuthState();

  return <TermsView authState={authState} />;
}
