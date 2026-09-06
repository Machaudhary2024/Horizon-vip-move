"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize job queue handlers and cache on app load
    const initializeApp = async () => {
      try {
        // Dynamic import to ensure server functions run server-side
        const { initializeJobHandlers, initializeCache } = await import(
          "@/lib/app-init"
        );
        initializeJobHandlers();
        initializeCache();
        console.log("✓ App initialized with optimizations");
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    initializeApp();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
