import { getServerAuthState } from "@/entities/session";
import { HomeView } from "@/views/home";

export const dynamic = "force-dynamic";

export default async function Home() {
  const authState = await getServerAuthState();

  return <HomeView authState={authState} />;
}
