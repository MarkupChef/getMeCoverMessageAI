import { getServerAuthState } from "@/entities/session";
import { PricingView } from "@/views/pricing";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const authState = await getServerAuthState();

  return <PricingView authState={authState} mode="public" />;
}
