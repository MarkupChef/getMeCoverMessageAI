import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppProviders } from "@/app/providers/AppProviders";
import { routing } from "@/shared/i18n";
import messages from "@/shared/i18n/messages/en";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function DefaultLocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setRequestLocale(routing.defaultLocale);

  return (
    <html
      lang={routing.defaultLocale}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider
          locale={routing.defaultLocale}
          messages={messages}
        >
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
