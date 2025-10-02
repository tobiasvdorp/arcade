"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/ui/navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-background text-foreground">
      <header
        role="banner"
        className="sticky top-0 z-40 bg-background/70 glass"
      >
        <Navbar />
      </header>
      <main role="main" id="main-content" className="container py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={prefersReduced ? false : { opacity: 0, y: 6 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer role="contentinfo" className="border-t border-border/60">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mini Game Arcade
        </div>
      </footer>
    </div>
  );
}
