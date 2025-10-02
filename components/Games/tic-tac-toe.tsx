"use client";

import { useEffect } from "react";
// @ts-expect-error no declaration file
import confetti from "canvas-confetti";
import { GameLayout } from "@/components/game/GameLayout";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { KeyLegend } from "@/components/game/KeyLegend";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { type Cell, calculateWinner } from "@/convex/shared/ticTacToe";
import { LoaderCircle } from "lucide-react";

export const TicTacToe = () => {
  const { isSignedIn } = useAuth();
  const ttt = api.functions.games.ticTacToe;
  const game = useQuery(ttt.getMyGame, {});
  const createGame = useMutation(ttt.getOrCreateGame);
  const makeMove = useMutation(ttt.makeMove);
  const resetGame = useMutation(ttt.resetGame);

  useEffect(() => {
    if (!isSignedIn) return;
    if (game === null) {
      void createGame({});
    }
  }, [game, isSignedIn, createGame]);

  const board: Cell[] = (game?.gameData.board ?? Array(9).fill("")).map(
    (c: string) => (c === "" ? null : (c as Cell)),
  );
  const xIsNext = (game?.gameData.turn ?? "X") === "X";
  const winner = calculateWinner(board);

  useEffect(() => {
    if (!winner) return;
    const reduced = document.documentElement.hasAttribute(
      "data-user-reduced-motion",
    );
    if (reduced) return;
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }, [winner]);

  const header = (
    <div className="flex items-center justify-between">
      <ScoreBoard score={board.filter(Boolean).length} highScore={0} />
      <KeyLegend
        items={[
          { key: "↵", label: "Select" },
          { key: "R", label: "Reset" },
        ]}
      />
    </div>
  );

  if (!isSignedIn) {
    return (
      <GameLayout header={header}>
        <div className="text-center py-10">Log in to play.</div>
      </GameLayout>
    );
  }

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    void makeMove({ index: idx });
  };

  return (
    <GameLayout header={header}>
      <div
        role="grid"
        aria-label="Tic Tac Toe board"
        className="grid grid-cols-3 gap-2 max-w-xl mx-auto"
      >
        {!game ? (
          <div className="col-span-3 row-span-3 aspect-square rounded-2xl glass shadow-soft text-2xl flex flex-col items-center justify-center gap-2">
            <LoaderCircle className="size-12 animate-spin" />
          </div>
        ) : (
          board.map((cell, i) => (
            <button
              key={i}
              role="gridcell"
              aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ""}`}
              onClick={() => handleClick(i)}
              disabled={Boolean(winner)}
              className={
                "aspect-square rounded-2xl glass shadow-soft text-2xl font-bold hover:glow transition-all duration-200 ease-out hover:scale-[1.02] hover:border-accent"
              }
            >
              {cell}
            </button>
          ))
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? "X" : "O"}`}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground"
          onClick={() => resetGame()}
        >
          Reset
        </button>
      </div>
    </GameLayout>
  );
};
