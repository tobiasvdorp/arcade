import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  ticTacToeGames: defineTable({
    user: v.id("users"),
    gameId: v.string(),
    gameData: v.object({
      board: v.array(v.string()),
      turn: v.union(v.literal("X"), v.literal("O")),
    }),
    moves: v.array(
      v.object({
        index: v.number(),
        player: v.union(v.literal("X"), v.literal("O")),
      }),
    ),
  })
    .index("by_user", ["user"])
    .index("by_gameId", ["gameId"]),
});
