import { v } from "convex/values";
import {
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";

export type Cell = "X" | "O" | null;

export function calculateWinner(squares: ("X" | "O" | null)[]): Cell {
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

async function getUserIdReadOnly(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .first();
  return existing?._id ?? null;
}

async function ensureUserId(ctx: MutationCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .first();
  if (existing) return existing._id;
  return null;
  // return await ctx.db.insert("users", {
  //   id: identity.subject,
  //   email: identity.email ?? "",
  //   name: identity.name ?? "",
  // });
}

export const getMyGame = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdReadOnly(ctx);
    if (!userId) return null;
    const game = await ctx.db
      .query("ticTacToeGames")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();
    return game;
  },
});

export const getOrCreateGame = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ensureUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const current = await ctx.db
      .query("ticTacToeGames")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();
    if (current) return current;

    const empty: Cell[] = Array(9).fill(null);
    const docId = await ctx.db.insert("ticTacToeGames", {
      user: userId,
      gameId: crypto.randomUUID(),
      gameData: { board: empty.map((c) => (c === null ? "" : c)), turn: "X" },
      moves: [],
    });
    return await ctx.db.get(docId);
  },
});

export const makeMove = mutation({
  args: { index: v.number() },
  handler: async (ctx, { index }) => {
    if (index < 0 || index > 8) throw new Error("Invalid move index");

    const userId = await ensureUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const game = await ctx.db
      .query("ticTacToeGames")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();
    if (!game) throw new Error("No game found");

    const board: Cell[] = game.gameData.board.map((c) =>
      c === "" ? null : (c as Cell),
    );
    const xIsNext = game.gameData.turn === "X";
    if (board[index] || calculateWinner(board)) return;

    board[index] = xIsNext ? "X" : "O";
    const nextTurn = xIsNext ? "O" : "X";

    await ctx.db.patch(game._id, {
      gameData: {
        board: board.map((c) => (c === null ? "" : c)),
        turn: nextTurn,
      },
      moves: [...game.moves, { index, player: xIsNext ? "X" : "O" }],
    });

    return await ctx.db.get(game._id);
  },
});

export const resetGame = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ensureUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const game = await ctx.db
      .query("ticTacToeGames")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();
    if (!game) return null;

    const empty: Cell[] = Array(9).fill(null);
    await ctx.db.patch(game._id, {
      gameData: { board: empty.map((c) => (c === null ? "" : c)), turn: "X" },
      moves: [],
    });
    return await ctx.db.get(game._id);
  },
});
