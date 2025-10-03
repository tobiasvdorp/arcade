"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameLayout, useGameLayout } from "@/components/game/GameLayout";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { KeyLegend } from "@/components/game/KeyLegend";

const GRID_SIZE = 18;
const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];
const INITIAL_DIRECTION: Direction = { x: 1, y: 0 };
const SPEED = 140;

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
};

type Point = { x: number; y: number };
type Direction = { x: number; y: number };

type GameStatus = "running" | "over";

const randomFood = (snake: Point[]): Point => {
  const occupied = new Set(snake.map((segment) => `${segment.x}-${segment.y}`));
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${point.x}-${point.y}`));
  return point;
};

export function Snake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE));
  const [status, setStatus] = useState<GameStatus>("running");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("snake:high-score");
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) setHighScore(parsed);
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    localStorage.setItem("snake:high-score", highScore.toString());
  }, [highScore]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    const nextFood = randomFood(INITIAL_SNAKE);
    setFood(nextFood);
    setScore(0);
    setStatus("running");
  }, []);

  const header = (
    <SnakeHeader
      score={score}
      highScore={highScore}
      status={status}
      onReset={resetGame}
    />
  );

  return (
    <GameLayout header={header}>
      <SnakeBoard
        snake={snake}
        setSnake={setSnake}
        direction={direction}
        setDirection={setDirection}
        food={food}
        setFood={setFood}
        status={status}
        setStatus={setStatus}
        setScore={setScore}
        onReset={resetGame}
      />
    </GameLayout>
  );
}

type SnakeHeaderProps = {
  score: number;
  highScore: number;
  status: GameStatus;
  onReset: () => void;
};

function SnakeHeader({ score, highScore, status, onReset }: SnakeHeaderProps) {
  const { paused, setPaused, announce } = useGameLayout();
  const handlePauseToggle = () => {
    setPaused(!paused);
    announce(paused ? "Game resumed" : "Game paused");
  };

  const handleReset = () => {
    setPaused(false);
    onReset();
    announce("Game restarted");
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <ScoreBoard score={score} highScore={highScore} />
      <div className="flex flex-wrap items-center gap-2">
        <KeyLegend
          items={[
            { key: "↑↓←→", label: "Move" },
            { key: "WASD", label: "Move" },
            { key: "Space", label: paused ? "Resume" : "Pause" },
            { key: "R", label: "Restart" },
          ]}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft"
            onClick={handlePauseToggle}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            className="rounded-2xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-soft"
            onClick={handleReset}
          >
            Restart
          </button>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {status === "over"
          ? "Game over"
          : paused
            ? "Paused"
            : "Collect the glowing bites"}
      </span>
    </div>
  );
}

type SnakeBoardProps = {
  snake: Point[];
  setSnake: Dispatch<SetStateAction<Point[]>>;
  direction: Direction;
  setDirection: Dispatch<SetStateAction<Direction>>;
  food: Point;
  setFood: Dispatch<SetStateAction<Point>>;
  status: GameStatus;
  setStatus: Dispatch<SetStateAction<GameStatus>>;
  setScore: Dispatch<SetStateAction<number>>;
  onReset: () => void;
};

function SnakeBoard({
  snake,
  setSnake,
  direction,
  setDirection,
  food,
  setFood,
  status,
  setStatus,
  setScore,
  onReset,
}: SnakeBoardProps) {
  const { paused, setPaused, announce } = useGameLayout();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === "running") {
      boardRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status !== "running" || paused) return;

    const tick = window.setInterval(() => {
      setSnake((prev) => {
        const currentDirection = directionRef.current;
        const head = prev[0];
        const nextHead = {
          x: head.x + currentDirection.x,
          y: head.y + currentDirection.y,
        };

        const outside =
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE;
        const hitsSelf = prev.some(
          (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
        );

        if (outside || hitsSelf) {
          setStatus("over");
          setPaused(true);
          announce("Game over. Press restart to try again.");
          return prev;
        }

        const newSnake = [nextHead, ...prev];
        const foodPoint = foodRef.current;
        if (nextHead.x === foodPoint.x && nextHead.y === foodPoint.y) {
          setScore((value) => {
            const nextScore = value + 10;
            announce(`Yum! Score ${nextScore}`);
            return nextScore;
          });
          const nextFood = randomFood(newSnake);
          setFood(nextFood);
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, SPEED);

    return () => {
      window.clearInterval(tick);
    };
  }, [announce, paused, setFood, setPaused, setScore, setSnake, setStatus, status]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = event;
      if (key === " " || key === "Spacebar") {
        event.preventDefault();
        if (status === "over") {
          setPaused(false);
          onReset();
          announce("Game restarted");
          return;
        }
        setPaused(!paused);
        announce(paused ? "Game resumed" : "Game paused");
        return;
      }
      if (key === "r" || key === "R") {
        event.preventDefault();
        setPaused(false);
        onReset();
        announce("Game restarted");
        return;
      }

      const nextDirection = KEY_TO_DIRECTION[key];
      if (!nextDirection) return;

      event.preventDefault();
      setDirection((current) => {
        if (current.x + nextDirection.x === 0 && current.y + nextDirection.y === 0) {
          return current;
        }
        return nextDirection;
      });
      if (status === "over") {
        setPaused(false);
        onReset();
        announce("Game restarted");
      } else if (paused) {
        setPaused(false);
        announce("Game resumed");
      }
    },
    [announce, onReset, paused, setDirection, setPaused, status],
  );

  const snakeSet = useMemo(() => {
    return new Set(snake.map((segment) => `${segment.x}-${segment.y}`));
  }, [snake]);

  const head = snake[0] ?? { x: 0, y: 0 };

  const cells = useMemo(() => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const key = `${x}-${y}`;
      const isSnake = snakeSet.has(key);
      const isHead = head.x === x && head.y === y;
      const isFood = food.x === x && food.y === y;

      return (
        <div
          key={key}
          className={
            "relative flex items-center justify-center transition-transform duration-100 " +
            (isSnake
              ? "bg-[hsl(var(--primary)/.85)] shadow-soft rounded-xl"
              : "bg-[hsl(var(--muted)/.35)] rounded-lg")
          }
        >
          {isHead && (
            <span className="absolute size-2 rounded-full bg-primary-foreground shadow-sm" aria-hidden="true" />
          )}
          {isFood && (
            <span
              className="absolute size-3 rounded-full bg-accent shadow-[0_0_18px_hsl(var(--accent)/0.55)] animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>
      );
    });
  }, [food.x, food.y, head.x, head.y, snakeSet]);

  return (
    <div className="relative">
      <div
        ref={boardRef}
        tabIndex={0}
        role="application"
        aria-label="Snake board"
        className="outline-none"
        onKeyDown={handleKeyDown}
      >
        <div
          className="mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background/95 to-background/80 p-3 shadow-inner"
        >
          <div
            className="grid h-full w-full gap-1"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {cells}
          </div>
        </div>
      </div>
      {status === "over" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl bg-background/80 px-6 py-4 text-center shadow-layered">
            <h2 className="text-2xl font-semibold">Game Over</h2>
            <p className="text-sm text-muted-foreground">
              Press R to restart or use the controls above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
