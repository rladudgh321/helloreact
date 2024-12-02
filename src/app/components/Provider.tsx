"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export const Provider = ({children}: {children: React.ReactNode}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        {children}
      </Suspense>
    </QueryClientProvider>

  );
}