# Mini Game Arcade – Design System & Pages

This project implements a modern, playful "Mini Game Arcade" with retro neon accents and clean glasmorphism, built with Next.js App Router, TypeScript, Tailwind v4 design tokens, shadcn/ui (Radix), framer-motion, and accessible WCAG AA patterns.

## Styleguide (Tokens)

- Colors: electric blue (primary), neon purple (accent), accent yellow, neutral grays
- Shapes: rounded-2xl (`--radius: 1rem`), glass backgrounds, layered shadows
- Motion: 150–220ms route fades/slides; hover scale 1.02; respects reduced motion
- Focus: visible focus with outline and offset; not color-only

See `app/globals.css` for tokens: `--primary`, `--accent`, `--accent-2`, `--glass-*`, shadows, motion, and dark mode parity.

## Components

- AppShell (`components/AppShell.tsx`): semantic header/main/footer, route transitions
- ThemeProvider/ThemeToggle (`components/ui`) with `next-themes`
- NeoArcadeDock (`components/NeoArcadeDock.tsx`): bottom dock with Radix Tabs
- GameCard (`components/GameCard.tsx`): arcade grid cards with difficulty badges
- GameLayout/ScoreBoard/KeyLegend (`components/game/*`): accessible game wrapper
- A11y utilities: FocusRing, EmptyState, Skeleton, AchievementBadge
- Leaderboards: virtualized list with Radix Tabs
- Pages: `/leaderboards`, `/profile`, `/settings`, `/games/[slug]`

## Accessibility

- Landmarks: header/nav/main/footer; headings hierarchy
- Focus-visible outlines with offset; keyboard and touch support
- `aria-live` for game status; alt text; reduced-motion toggle in Settings
- Layout tested to 200% zoom

## Animations

- Route transitions via framer-motion (`AppShell`)
- Hover glow pulse and layered shadows
- Confetti on achievements/wins (disabled with reduced motion)

## Development

pnpm dev

Then open `http://localhost:3000`. Auth is managed by Clerk (unchanged).

# Welcome to your Convex + Next.js + Clerk app

This is a [Convex](https://convex.dev/) project created with [`npm create convex`](https://www.npmjs.com/package/create-convex).

After the initial setup (<2 minutes) you'll have a working full-stack app using:

- Convex as your backend (database, server logic)
- [React](https://react.dev/) as your frontend (web page interactivity)
- [Next.js](https://nextjs.org/) for optimized web hosting and page routing
- [Tailwind](https://tailwindcss.com/) for building great looking accessible UI
- [Clerk](https://clerk.com/) for authentication

## Get started

If you just cloned this codebase and didn't use `npm create convex`, run:

```
npm install
npm run dev
```

If you're reading this README on GitHub and want to use this template, run:

```
npm create convex@latest -- -t nextjs-clerk
```

Then:

1. Open your app. There should be a "Claim your application" button from Clerk in the bottom right of your app.
2. Follow the steps to claim your application and link it to this app.
3. Follow step 3 in the [Convex Clerk onboarding guide](https://docs.convex.dev/auth/clerk#get-started) to create a Convex JWT template.
4. Uncomment the Clerk provider in `convex/auth.config.ts`
5. Paste the Issuer URL as `CLERK_JWT_ISSUER_DOMAIN` to your dev deployment environment variable settings on the Convex dashboard (see [docs](https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances))

If you want to sync Clerk user data via webhooks, check out this [example repo](https://github.com/thomasballinger/convex-clerk-users-table/).

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.

## Join the community

Join thousands of developers building full-stack apps with Convex:

- Join the [Convex Discord community](https://convex.dev/community) to get help in real-time.
- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
