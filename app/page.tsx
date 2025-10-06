import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { LuArrowRight } from "react-icons/lu";
import { GAMES } from "@/lib/data/games";

export default function Home() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Mini Game Arcade
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-prose">
            Playful, modern and accessible. Play Snake, Tetris and Memory with
            neon glow accents and glass UI.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href="#arcade">
                Play now <LuArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href="/leaderboards">Leaderboards </Link>
            </Button>
          </div>
        </div>
        <div
          className="aspect-[4/3] rounded-2xl glass shadow-layered border relative"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--color-accent)/.35),transparent_35%),radial-gradient(ellipse_at_bottom_right,hsl(var(--color-primary)/.35),transparent_35%)]" />
        </div>
      </div>

      <div id="arcade" className="container py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Arcade</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.title} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
