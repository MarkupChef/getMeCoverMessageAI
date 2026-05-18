import { SiteHeader } from "@/widgets/site-header";
import { UserMenu } from "@/widgets/user-menu";

export function ProtectedSiteLayout({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        isAuthenticated
        userMenu={<UserMenu email={userEmail} />}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
