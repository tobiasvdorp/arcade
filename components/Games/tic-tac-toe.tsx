"use client";

import { useEffect, useMemo, useState } from "react";
// @ts-expect-error no declaration file
import confetti from "canvas-confetti";
import { GameLayout } from "@/components/game/GameLayout";
import { useMutation, useQuery } from "convex/react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { type Cell, calculateWinner } from "@/convex/shared/ticTacToe";
import { LoaderCircle } from "lucide-react";

export const TicTacToe = () => {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const ttt = api.functions.games.ticTacToe;
  const game = useQuery(ttt.getMyGame, {});
  const createGame = useMutation(ttt.getOrCreateGame);
  const makeMove = useMutation(ttt.makeMove);
  const resetGame = useMutation(ttt.resetGame);
  const saveGameState = useMutation(ttt.saveGameState);

  // Guest play state (for unauthenticated users)
  const [guestBoard, setGuestBoard] = useState<Cell[]>(
    Array(9).fill(null) as Cell[],
  );
  const [guestTurn, setGuestTurn] = useState<"X" | "O">("X");
  const [guestMoves, setGuestMoves] = useState<
    { index: number; player: "X" | "O" }[]
  >([]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (game === null) {
      void createGame({});
    }
  }, [game, isSignedIn, createGame]);

  // Compute board/turn based on authentication state
  const board: Cell[] = useMemo(() => {
    if (isSignedIn) {
      return (game?.gameData.board ?? Array(9).fill("")).map((c: string) =>
        c === "" ? null : (c as Cell),
      );
    }
    return guestBoard;
  }, [isSignedIn, game?.gameData.board, guestBoard]);

  const xIsNext = useMemo(() => {
    return isSignedIn
      ? (game?.gameData.turn ?? "X") === "X"
      : guestTurn === "X";
  }, [isSignedIn, game?.gameData.turn, guestTurn]);

  const winner = calculateWinner(board);

  // Hydration handled by Zustand persist; no manual load needed

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

  const movesCount = board.filter(Boolean).length;

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    if (isSignedIn) {
      void makeMove({ index: idx });
    } else {
      const nextPlayer: "X" | "O" = xIsNext ? "X" : "O";
      const nextBoard = [...guestBoard];
      nextBoard[idx] = nextPlayer;
      setGuestBoard(nextBoard);
      setGuestTurn(nextPlayer === "X" ? "O" : "X");
      setGuestMoves([...guestMoves, { index: idx, player: nextPlayer }]);
    }
  };

  // When user signs in, if there is a guest game, persist it to Convex
  useEffect(() => {
    const persistIfNeeded = async () => {
      if (!isSignedIn) return;
      const raw = localStorage.getItem("ttt:guestGame");
      if (!raw) return;
      try {
        const data = JSON.parse(raw) as {
          board: Cell[];
          turn: "X" | "O";
          moves: { index: number; player: "X" | "O" }[];
        };
        await saveGameState({
          board: data.board,
          turn: data.turn,
          moves: data.moves,
        });
      } finally {
        localStorage.removeItem("ttt:guestGame");
      }
    };
    void persistIfNeeded();
  }, [isSignedIn, saveGameState]);

  const onSaveGame = async () => {
    // Store guest game in localStorage, then open Clerk sign-in modal
    const payload = {
      board: guestBoard,
      turn: guestTurn,
      moves: guestMoves,
    };
    localStorage.setItem("ttt:guestGame", JSON.stringify(payload));
    await openSignIn();
  };

  return (
    <GameLayout
      title="Tic Tac Toe"
      runningDescription={
        winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? "X" : "O"}`
      }
      isGameOver={Boolean(winner)}
      score={movesCount}
      highScore={0}
      legendItems={[
        { key: "↵", label: "Select" },
        { key: "R", label: "Reset" },
      ]}
    >
      <div
        role="grid"
        aria-label="Tic Tac Toe board"
        className="grid grid-cols-3 gap-2 max-w-xl mx-auto"
      >
        {isSignedIn && !game ? (
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
        {isSignedIn ? (
          <button
            className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground"
            onClick={() => resetGame()}
          >
            Reset
          </button>
        ) : (
          <>
            <button
              className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground"
              onClick={() => {
                setGuestBoard(Array(9).fill(null) as Cell[]);
                setGuestTurn("X");
                setGuestMoves([]);
              }}
            >
              Reset
            </button>
            <button
              className="rounded-2xl px-4 py-2 bg-accent text-accent-foreground"
              onClick={onSaveGame}
            >
              Save game
            </button>
          </>
        )}
      </div>
    </GameLayout>
  );
};
