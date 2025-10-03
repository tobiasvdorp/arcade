"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameLayout, useGameLayout } from "@/components/game/GameLayout";
import { KeyLegend } from "@/components/game/KeyLegend";
import { ScoreBoard } from "@/components/game/ScoreBoard";

const GRID_SIZE = 20;
const INITIAL_SPEED = 140;
const STORAGE_KEY = "snake:highScore";

const INITIAL_DIRECTION = { x: 1, y: 0 } as const;

type Point = { x: number; y: number };

type CellState = "empty" | "snake" | "head" | "food";

const INITIAL_SNAKE: Point[] = [
  { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
];

const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function createFood(exclude: Point[]): Point {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!exclude.some((p) => p.x === x && p.y === y)) {
      return { x, y };
    }
  }
}

function isOpposite(dir: Point, next: Point) {
  return dir.x + next.x === 0 && dir.y + next.y === 0;
}

export function Snake() {
  const { setPaused, announce } = useGameLayout();
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [pendingDirection, setPendingDirection] = useState<Point | null>(null);
  const [food, setFood] = useState<Point>(() => createFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [status, setStatus] = useState<"playing" | "paused" | "game-over">(
    "playing",
  );
  const animationRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const value = Number.parseInt(stored, 10);
    if (!Number.isNaN(value)) {
      setHighScore(value);
    }
  }, []);

  const applyHighScore = useCallback((maybeScore: number) => {
    setHighScore((prev) => {
      if (maybeScore > prev) {
        localStorage.setItem(STORAGE_KEY, String(maybeScore));
        return maybeScore;
      }
      return prev;
    });
  }, []);

  const endGame = useCallback(
    (finalScore: number) => {
      setStatus("game-over");
      setPaused(true);
      applyHighScore(finalScore);
      announce("Game over. Press R to restart.");
    },
    [announce, applyHighScore, setPaused],
  );

  const step = useCallback(() => {
    setSnake((prev) => {
      const chosenDirection =
        pendingDirection && !isOpposite(direction, pendingDirection)
          ? pendingDirection
          : direction;

      if (chosenDirection !== direction) {
        setDirection(chosenDirection);
      }
      setPendingDirection(null);

      const head = prev[0];
      const nextHead = {
        x: (head.x + chosenDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + chosenDirection.y + GRID_SIZE) % GRID_SIZE,
      };

      const collision = prev.some(
        (segment, index) => index !== 0 && segment.x === nextHead.x && segment.y === nextHead.y,
      );
      if (collision) {
        endGame(score);
        return prev;
      }

      const nextSnake = [nextHead, ...prev];
      const ateFood = nextHead.x === food.x && nextHead.y === food.y;

      if (ateFood) {
        const nextScore = score + 10;
        setScore(nextScore);
        applyHighScore(nextScore);
        setFood(createFood(nextSnake));
        setSpeed((s) => Math.max(70, s - 4));
        announce(`Yum! Score ${nextScore}`);
        return nextSnake;
      }

      nextSnake.pop();
      return nextSnake;
    });
  }, [announce, applyHighScore, direction, endGame, food, pendingDirection, score]);

  const resume = useCallback(() => {
    setStatus("playing");
    setPaused(false);
    announce("Game resumed");
    lastTickRef.current = 0;
  }, [announce, setPaused]);

  const pause = useCallback(() => {
    setStatus("paused");
    setPaused(true);
    announce("Game paused");
  }, [announce, setPaused]);

  const togglePause = useCallback(() => {
    if (status === "game-over") return;
    if (status === "paused") {
      resume();
    } else {
      pause();
    }
  }, [pause, resume, status]);

  const restart = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setPendingDirection(null);
    setFood(createFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus("playing");
    setPaused(false);
    announce("New game started");
    lastTickRef.current = 0;
  }, [announce, setPaused]);

  useEffect(() => {
    if (status !== "playing") return;

    const tick = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
      }
      const delta = timestamp - lastTickRef.current;
      if (delta >= speed) {
        lastTickRef.current = timestamp;
        step();
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [speed, status, step]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "p" || event.key === "P" || event.code === "Space") {
        event.preventDefault();
        togglePause();
        return;
      }
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        restart();
        return;
      }

      const nextDirection = DIRECTIONS[event.key];
      if (!nextDirection) return;
      event.preventDefault();
      setPendingDirection((prev) => {
        const base = prev ?? direction;
        if (isOpposite(base, nextDirection)) {
          return prev;
        }
        return nextDirection;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, restart, togglePause]);

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <ScoreBoard score={score} highScore={highScore} />
        <div className="rounded-xl bg-foreground/5 px-3 py-2 text-sm text-muted-foreground">
          {status === "game-over" ? "Game over" : status === "paused" ? "Paused" : "Playing"}
        </div>
      </div>
      <KeyLegend
        items={[
          { key: "↑↓←→", label: "Move" },
          { key: "WASD", label: "Move" },
          { key: "Space/P", label: "Pause" },
          { key: "R", label: "Restart" },
        ]}
      />
    </div>
  );

  const boardCells = useMemo(() => {
    const cells: CellState[] = Array(GRID_SIZE * GRID_SIZE).fill("empty");
    snake.forEach((segment, index) => {
      const idx = segment.y * GRID_SIZE + segment.x;
      cells[idx] = index === 0 ? "head" : "snake";
    });
    const foodIdx = food.y * GRID_SIZE + food.x;
    cells[foodIdx] = "food";
    return cells;
  }, [snake, food]);

  return (
    <GameLayout header={header}>
      <div className="grid gap-4">
        <div className="mx-auto w-full max-w-[min(80vw,520px)]">
          <div className="relative rounded-3xl border border-foreground/10 bg-gradient-to-br from-background via-background/80 to-muted/60 p-4 shadow-inner">
            <div
              role="grid"
              aria-label="Snake board"
              className="grid aspect-square gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {boardCells.map((state, idx) => (
                <div
                  key={idx}
                  role="gridcell"
                  aria-hidden={state === "empty"}
                  className={
                    "rounded-xl transition-colors duration-150 ease-out " +
                    (state === "food"
                      ? "bg-accent shadow-[0_0_15px_rgba(255,134,75,0.45)]"
                      : state === "head"
                        ? "bg-primary shadow-[0_0_16px_rgba(99,102,241,0.55)]"
                        : state === "snake"
                          ? "bg-primary/70"
                          : "bg-background/40")
                  }
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                className="flex-1 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:glow"
                onClick={status === "game-over" ? restart : togglePause}
                type="button"
              >
                {status === "paused" ? "Resume" : status === "game-over" ? "Play again" : "Pause"}
              </button>
              <button
                className="flex-1 rounded-2xl bg-muted px-4 py-2 text-sm font-medium text-foreground/80 shadow-soft transition hover:border"
                onClick={restart}
                type="button"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {status === "game-over"
            ? "You crashed into yourself. Press Play again to try once more!"
            : status === "paused"
              ? "Take a breather—resume when you are ready."
              : "Guide the snake to collect the glowing food. Every bite speeds things up!"}
        </p>
      </div>
    </GameLayout>
  );
}

export default Snake;
