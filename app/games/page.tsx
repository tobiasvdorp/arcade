import Link from "next/link";
import { GameCard } from "@/components/GameCard";

const GAMES = [
  {
    slug: "/games/tic-tac-toe",
    title: "Tic Tac Toe",
    desc: "3 op een rij.",
    diff: "Easy" as const,
    available: true,
  },
  {
    slug: "#",
    title: "Snake",
    desc: "Binnenkort beschikbaar.",
    diff: "Medium" as const,
    available: false,
  },
  {
    slug: "#",
    title: "Tetris",
    desc: "Binnenkort beschikbaar.",
    diff: "Hard" as const,
    available: false,
  },
  {
    slug: "#",
    title: "Memory",
    desc: "Binnenkort beschikbaar.",
    diff: "Medium" as const,
    available: false,
  },
  {
    slug: "#",
    title: "Pong",
    desc: "Binnenkort beschikbaar.",
    diff: "Medium" as const,
    available: false,
  },
];

export default function GamesPage() {
  return (
    <section className="container py-8" aria-labelledby="games-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 id="games-heading" className="text-3xl font-bold">
            Games
          </h1>
          <p className="text-sm text-muted-foreground">
            Kies je spel en ga los.
          </p>
        </div>
        <div
          className="flex items-center gap-2"
          role="search"
          aria-label="Search games"
        >
          <input
            type="search"
            placeholder="Search games"
            className="h-10 rounded-xl border bg-background px-3"
            aria-label="Search games"
          />
          <select
            aria-label="Filter difficulty"
            className="h-10 rounded-xl border bg-background px-2"
          >
            <option value="all">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {GAMES.map((g) => (
          <GameCard
            key={g.title}
            href={g.available ? g.slug : undefined}
            title={g.title}
            description={g.desc}
            difficulty={g.diff}
            disabled={!g.available}
          />
        ))}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <span>Of ga direct naar </span>
        <Link href="/leaderboards" className="underline underline-offset-4">
          Leaderboards
        </Link>
        <span> of </span>
        <Link href="/profile" className="underline underline-offset-4">
          Profiel
        </Link>
        <span>.</span>
      </div>
    </section>
  );
}
