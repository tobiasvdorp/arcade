"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { GameLayout } from "@/components/game/GameLayout";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { KeyLegend } from "@/components/game/KeyLegend";

type Cell = "X" | "O" | null;

export const TicTacToe = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (idx: number) => {
    if (board[idx] || calculateWinner(board)) return;
    const next = board.slice();
    next[idx] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  };

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

  return (
    <GameLayout header={header}>
      <div
        role="grid"
        aria-label="Tic Tac Toe board"
        className="grid grid-cols-3 gap-2 max-w-xl mx-auto"
      >
        {board.map((cell, i) => (
          <button
            key={i}
            role="gridcell"
            aria-label={`Vak ${i + 1}${cell ? `, ${cell}` : ""}`}
            onClick={() => handleClick(i)}
            className="aspect-square rounded-2xl glass shadow-soft text-2xl font-bold hover:glow transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02]"
          >
            {cell}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {winner ? `Winnaar: ${winner}` : `Beurt: ${xIsNext ? "X" : "O"}`}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground"
          onClick={() => {
            setBoard(Array(9).fill(null));
            setXIsNext(true);
          }}
        >
          Reset
        </button>
      </div>
    </GameLayout>
  );
};

function calculateWinner(squares: Cell[]): Cell {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
