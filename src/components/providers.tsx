"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 60 seconds
        },
      },
    })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
