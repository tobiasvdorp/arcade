"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PixelCanvas } from "./pixel-canvas";
import { useRouter } from "next/navigation";
import { GAMES } from "@/lib/data/games";
import { LuChevronUp, LuChevronDown } from "react-icons/lu";

type ArcadeMachineProps = {
  className?: string;
};

export function ArcadeMachine({ className }: ArcadeMachineProps) {
  const router = useRouter();
  const availableGames = GAMES.filter((game) => game.available);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [pressedDirection, setPressedDirection] = useState<string | null>(null);
  const [pressedSelect, setPressedSelect] = useState(false);

  const handleDirectionPress = useCallback(
    (direction: "up" | "down") => {
      setPressedDirection(direction);
      setTimeout(() => setPressedDirection(null), 150);

      if (direction === "up") {
        setSelectedGameIndex((prev) =>
          prev > 0 ? prev - 1 : availableGames.length - 1,
        );
      } else {
        setSelectedGameIndex((prev) =>
          prev < availableGames.length - 1 ? prev + 1 : 0,
        );
      }
    },
    [availableGames.length],
  );

  const handleSelect = useCallback(() => {
    setPressedSelect(true);
    setTimeout(() => setPressedSelect(false), 200);

    const selectedGame = availableGames[selectedGameIndex];
    if (selectedGame) {
      setTimeout(() => router.push(selectedGame.href), 100);
    }
  }, [availableGames, selectedGameIndex, router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleDirectionPress("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleDirectionPress("down");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDirectionPress, handleSelect]);

  return (
    <motion.div
      className={`relative aspect-[4/5] w-full max-w-xs sm:max-w-md mx-auto min-w-[430px] ${className || ""}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {/* Main arcade cabinet */}
      <div className="relative h-full rounded-2xl glass shadow-layered border overflow-hidden group">
        {/* Header - above the screen */}
        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-30 px-2">
          <h3 className="text-xs sm:text-base font-bold text-center tracking-wider text-primary drop-shadow-[0_0_8px_hsl(var(--color-primary)/0.5)]">
            Choose your game
          </h3>
        </div>

        {/* Screen area - game list */}
        <div className="absolute top-[8%] sm:top-[8%] left-[4%] sm:left-[5%] right-[4%] sm:right-[5%] aspect-[4/3] rounded-lg bg-background/95 border-2 border-primary/30 shadow-inner overflow-hidden">
          {/* Animated background - PixelCanvas */}
          <PixelCanvas
            gap={10}
            speed={25}
            colors={["#3b82f6", "#a855f7", "#eab308"]}
            autoStart
            className="opacity-50"
          />

          {/* Screen glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

          {/* Game list */}
          <div className="absolute inset-0 p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 overflow-y-auto z-10">
            {availableGames.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No games available
              </div>
            ) : (
              availableGames.map((game, index) => {
                const isSelected = index === selectedGameIndex;
                const Icon = game.icon;
                return (
                  <motion.div
                    key={game.href}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all cursor-pointer glass ${
                      isSelected
                        ? "bg-primary/20 border-primary/60 shadow-md shadow-primary/20"
                        : "bg-background/40 border-border/30 hover:bg-background/60 hover:border-border/50"
                    }`}
                    animate={{
                      scale: isSelected ? 1.03 : 1,
                      x: isSelected ? 4 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary/30 text-primary"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform ${
                            isSelected ? "scale-110" : "scale-100"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {game.title}
                        </div>
                        <div
                          className={`text-[10px] sm:text-xs mt-0.5 line-clamp-1 ${
                            isSelected
                              ? "text-primary/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {game.menuDescription}
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium ${
                          isSelected
                            ? "bg-primary/30 text-primary border border-primary/40"
                            : "bg-muted text-muted-foreground border border-border/30"
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Screen bezel glow */}
          <div className="absolute -inset-1 rounded-lg bg-primary/20 blur-xl opacity-50" />
        </div>

        {/* Control panel - D-pad with center button */}
        <div className="absolute bottom-[8%] sm:bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 z-20">
          {/* D-pad */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            {/* Up button */}
            <motion.button
              onClick={() => handleDirectionPress("up")}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 sm:w-12 sm:h-8 rounded-t-md bg-background/80 border-2 border-primary/40 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring z-30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ pointerEvents: "auto" }}
              animate={{
                backgroundColor:
                  pressedDirection === "up"
                    ? "hsl(var(--color-primary) / 0.3)"
                    : "hsl(var(--color-background) / 0.8)",
                boxShadow:
                  pressedDirection === "up"
                    ? "0 0 15px hsl(var(--color-primary) / 0.6)"
                    : "0 0 0px hsl(var(--color-primary) / 0)",
              }}
              transition={{ duration: 0.15 }}
              aria-label="Move up"
            >
              <LuChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-primary" />
            </motion.button>

            {/* Left button - decorative only */}
            <div className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 w-6 h-10 sm:w-8 sm:h-12 rounded-l-md bg-background/60 border-2 border-primary/20 opacity-50 pointer-events-none" />

            {/* Center area */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 pointer-events-none" />

            {/* Right button - decorative only */}
            <div className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 w-6 h-10 sm:w-8 sm:h-12 rounded-r-md bg-background/60 border-2 border-primary/20 opacity-50 pointer-events-none" />

            {/* Down button */}
            <motion.button
              onClick={() => handleDirectionPress("down")}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-6 sm:w-12 sm:h-8 rounded-b-md bg-background/80 border-2 border-primary/40 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring z-30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ pointerEvents: "auto" }}
              animate={{
                backgroundColor:
                  pressedDirection === "down"
                    ? "hsl(var(--color-primary) / 0.3)"
                    : "hsl(var(--color-background) / 0.8)",
                boxShadow:
                  pressedDirection === "down"
                    ? "0 0 15px hsl(var(--color-primary) / 0.6)"
                    : "0 0 0px hsl(var(--color-primary) / 0)",
              }}
              transition={{ duration: 0.15 }}
              aria-label="Move down"
            >
              <LuChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-primary" />
            </motion.button>
          </div>

          {/* Center select button */}
          <motion.button
            onClick={handleSelect}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background/80 border-2 border-accent/40 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring z-30"
            style={{ pointerEvents: "auto" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: pressedSelect
                ? [
                    "0 0 20px hsl(var(--color-accent) / 0.8)",
                    "0 0 30px hsl(var(--color-accent) / 1)",
                    "0 0 20px hsl(var(--color-accent) / 0.8)",
                  ]
                : [
                    "0 0 0px hsl(var(--color-accent) / 0.3)",
                    "0 0 15px hsl(var(--color-accent) / 0.5)",
                    "0 0 0px hsl(var(--color-accent) / 0.3)",
                  ],
            }}
            transition={{
              boxShadow: {
                duration: pressedSelect ? 0.2 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            aria-label="Select game"
            title="Select and play game"
          >
            <div className="absolute inset-1.5 sm:inset-2 rounded-full bg-accent/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent" />
          </motion.button>
        </div>

        {/* Neon accent lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        {/* Side glow effects */}
        <div className="absolute top-[8%] left-0 w-2 h-[30%] bg-primary/30 blur-md rounded-r-full opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="absolute top-[8%] right-0 w-2 h-[30%] bg-accent/30 blur-md rounded-l-full opacity-50 group-hover:opacity-75 transition-opacity" />

        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-accent/40 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-accent/40 rounded-br-lg" />
      </div>
    </motion.div>
  );
}
