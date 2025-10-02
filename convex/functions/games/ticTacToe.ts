import { v } from "convex/values";
import {
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import type { Cell } from "../../shared/ticTacToe";
import { calculateWinner } from "../../shared/ticTacToe";

async function getUserId(
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

async function ensureUserId(ctx: MutationCtx): Promise<Id<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated via Clerk");

  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .first();

  if (existing) return existing._id;

  // Create user if authenticated in Clerk but not in Convex
  return await ctx.db.insert("users", {
    name: identity.name ?? "",
    tokenIdentifier: identity.subject,
  });
}

export const getMyGame = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
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

export const saveGameState = mutation({
  args: {
    board: v.array(v.union(v.literal("X"), v.literal("O"), v.null())),
    turn: v.union(v.literal("X"), v.literal("O")),
    moves: v.array(
      v.object({
        index: v.number(),
        player: v.union(v.literal("X"), v.literal("O")),
      }),
    ),
  },
  handler: async (ctx, { board, turn, moves }) => {
    const userId = await ensureUserId(ctx);

    const existing = await ctx.db
      .query("ticTacToeGames")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();

    const stringBoard = board.map((c) => (c === null ? "" : c));

    if (existing) {
      await ctx.db.patch(existing._id, {
        gameData: { board: stringBoard, turn },
        moves,
      });
      return await ctx.db.get(existing._id);
    }

    const docId = await ctx.db.insert("ticTacToeGames", {
      user: userId,
      gameId: crypto.randomUUID(),
      gameData: { board: stringBoard, turn },
      moves,
    });
    return await ctx.db.get(docId);
  },
});
