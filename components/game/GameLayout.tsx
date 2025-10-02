"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type GameLayoutContextValue = {
  paused: boolean;
  setPaused: (paused: boolean) => void;
  announce: (message: string) => void;
};

const GameLayoutContext = createContext<GameLayoutContextValue | null>(null);

export function useGameLayout() {
  const ctx = useContext(GameLayoutContext);
  if (!ctx) throw new Error("useGameLayout must be used within <GameLayout>");
  return ctx;
}

type GameLayoutProps = {
  header: ReactNode;
  children: ReactNode;
};

export function GameLayout({ header, children }: GameLayoutProps) {
  const [paused, setPaused] = useState(false);
  const liveRef = useRef<HTMLParagraphElement | null>(null);

  const value = useMemo(
    () => ({
      paused,
      setPaused,
      announce: (message: string) => {
        if (liveRef.current) liveRef.current.textContent = message;
      },
    }),
    [paused],
  );

  return (
    <GameLayoutContext.Provider value={value}>
      <div className="grid gap-4">
        <header
          className="glass rounded-2xl border shadow-soft px-4 py-3"
          role="region"
          aria-label="Game header"
        >
          {header}
        </header>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          ref={liveRef}
        />
        <section
          className="rounded-2xl border glass shadow-layered p-3"
          aria-label="Game area"
        >
          {children}
        </section>
      </div>
    </GameLayoutContext.Provider>
  );
}
