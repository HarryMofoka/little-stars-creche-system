"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { ActivityProvider } from "@/lib/activity";
import { LmsProvider } from "@/lib/lms-store";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ActivityProvider>
          <LmsProvider>
            {children}
            <Toaster />
          </LmsProvider>
        </ActivityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
