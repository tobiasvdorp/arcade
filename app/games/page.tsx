import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { GAMES } from "@/lib/data/games";

export default function GamesPage() {
  return (
    <section className="container py-8" aria-labelledby="games-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 id="games-heading" className="text-3xl font-bold">
            Games
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your game and start playing.
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
        {GAMES.map((game) => (
          <GameCard key={game.title} game={game} />
        ))}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <span>Or go directly to </span>
        <Link href="/leaderboards" className="underline underline-offset-4">
          Leaderboards
        </Link>
        <span> or </span>
        <Link href="/profile" className="underline underline-offset-4">
          Profile
        </Link>
        <span>.</span>
      </div>
    </section>
  );
}
