"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/motion/Toast";
import { ScrollProgress, ScrollToTop } from "@/components/motion/ScrollEffects";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ScrollProgress />
        {children}
        <ScrollToTop />
      </ToastProvider>
    </SessionProvider>
  );
}
