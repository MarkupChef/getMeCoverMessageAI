import type { Metadata } from "next";
import { AppProviders } from "@/app/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "A scalable SaaS scaffold built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
