"use client";

import { Divider } from "@/components/ui/divider";
import * as Tabs from "@radix-ui/react-tabs";
import { Virtuoso } from "react-virtuoso";
import { GAMES } from "@/lib/data/games";

type Item = { rank: number; player: string; score: number; game: string };

function generateMock(count = 200): Item[] {
  const gameNames = GAMES.map((game) => game.title);
  return Array.from({ length: count }).map((_, i) => ({
    rank: i + 1,
    player: `Player ${i + 1}`,
    score: Math.floor(Math.random() * 10000),
    game: gameNames[i % gameNames.length],
  }));
}

export default function LeaderboardsPage() {
  const all = generateMock();
  const friends = generateMock(40);
  const perGame = generateMock(100);
  return (
    <section className="container py-8" aria-labelledby="leaderboards-heading">
      <h1 id="leaderboards-heading" className="text-3xl font-bold mb-1">
        Leaderboards
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        This currently does not have any actual leaderboards. It is a mock
        implementation of the leaderboards page.
      </p>
      <Tabs.Root
        defaultValue="global"
        className="rounded-2xl glass shadow-layered block glow"
      >
        <div className="px-3 pt-3">
          <Tabs.List className="inline-flex gap-1 rounded-xl p-1">
            {[
              { value: "global", label: "Global" },
              { value: "friends", label: "Friends" },
              { value: "game", label: "Per game" },
            ].map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="rounded-lg px-3 py-1.5 data-[state=active]:bg-primary/12 data-[state=active]:text-primary hover:cursor-pointer"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
        <Divider />
        {[
          { key: "global", rows: all },
          { key: "friends", rows: friends },
          { key: "game", rows: perGame },
        ].map(({ key, rows }) => (
          <Tabs.Content key={key} value={key} className="outline-none">
            <div className="grid grid-cols-[64px_1fr_120px_120px] gap-3 px-4 py-3 text-sm text-muted-foreground">
              <div>#</div>
              <div>Player</div>
              <div>Score</div>
              <div>Game</div>
            </div>
            <Divider />
            <div className="h-[60vh]">
              <Virtuoso
                totalCount={rows.length}
                itemContent={(index) => {
                  const row = rows[index];
                  return (
                    <>
                      <div
                        className="grid grid-cols-[64px_1fr_120px_120px] gap-3 px-4 py-2"
                        role="row"
                        aria-rowindex={row.rank}
                      >
                        <div>{row.rank}</div>
                        <div>{row.player}</div>
                        <div>{row.score}</div>
                        <div>{row.game}</div>
                      </div>
                      <Divider />
                    </>
                  );
                }}
              />
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  );
}
