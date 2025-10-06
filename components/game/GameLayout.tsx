"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { KeyLegend } from "@/components/game/KeyLegend";

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

type KeyLegendItem = { key: string; label: string };

type GameLayoutProps = {
  title: string;
  runningDescription: string;
  isGameOver?: boolean;
  score: number;
  highScore?: number;
  legendItems: KeyLegendItem[];
  children: ReactNode;
};

export function GameLayout({
  title,
  runningDescription,
  isGameOver,
  score,
  highScore,
  legendItems,
  children,
}: GameLayoutProps) {
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="md:basis-1/3">
              <ScoreBoard score={score} highScore={highScore} />
            </div>
            <div className="flex-1 md:basis-1/3 text-center">
              <div className="text-sm text-muted-foreground">{title}</div>
              <div className="text-sm font-medium">
                {isGameOver
                  ? "Game over"
                  : paused
                    ? "Paused"
                    : runningDescription}
              </div>
            </div>
            <div className="md:basis-1/3 flex md:justify-end">
              <KeyLegend items={legendItems} />
            </div>
          </div>
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
