import Link from "next/link";
import { GameCard } from "@/components/GameCard";

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
            <Link
              href="#arcade"
              className="inline-flex items-center rounded-2xl px-5 py-3 bg-primary text-primary-foreground shadow-soft hover:glow transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]"
            >
              Play now
            </Link>
            <Link
              href="/leaderboards"
              className="inline-flex items-center rounded-2xl px-5 py-3 bg-accent/20 text-foreground shadow-sm hover:bg-accent/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]"
            >
              Leaderboards
            </Link>
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
          <GameCard
            href="/games/tic-tac-toe"
            title="Tic Tac Toe"
            description="Classic. Three in a row."
            difficulty="Easy"
          />
          <GameCard
            title="Snake"
            description="Coming soon."
            difficulty="Medium"
            disabled
          />
          <GameCard
            title="Tetris"
            description="Coming soon."
            difficulty="Hard"
            disabled
          />
        </div>
      </div>
    </section>
  );
}
