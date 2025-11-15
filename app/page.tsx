"use client";

import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import { GAMES } from "@/lib/data/games";
import { ArcadeMachine } from "@/components/ui/ArcadeMachine";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Home() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--color-accent)/.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--color-primary)/.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--color-accent-2)/.1),transparent_70%)]" />
      </div>

      <div className="container py-16 md:py-32 grid lg:grid-cols-2 gap-12 items-center relative">
        <motion.div
          variants={prefersReduced ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={prefersReduced ? {} : itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-accent/20 mb-6"
          >
            <LuSparkles className="size-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Welcome to the Arcade
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={prefersReduced ? {} : itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Mini Game
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-accent-2 bg-clip-text text-transparent">
              Arcade
            </span>
          </motion.h1>

          <motion.p
            variants={prefersReduced ? {} : itemVariants}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-prose leading-relaxed"
          >
            Playful, modern and accessible. Play Snake, Tetris and Memory with
            neon glow accents and glass UI.
          </motion.p>

          <motion.div
            variants={prefersReduced ? {} : itemVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="#arcade">
                Play now
                <LuArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/leaderboards">Leaderboards</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="relative">
          <ArcadeMachine />
        </div>
      </div>

      <div id="arcade" className="container py-16 md:py-20 relative">
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Arcade
            </span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose your game and start playing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.title}
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
