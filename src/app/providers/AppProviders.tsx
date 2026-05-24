"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AnonymousUsageProvider } from "@/features/anonymous-usage";
import { ThemeProvider } from "@/shared/lib/theme";
import { Toaster } from "@/shared/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AnonymousUsageProvider>{children}</AnonymousUsageProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
