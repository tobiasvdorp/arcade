# Mini Game Arcade

A modern, playful collection of browser-based mini-games built with Next.js.

> **Note:** This is a hobby project created to explore, learn, and experiment with **Convex** (for the backend/database) and **Clerk** (for authentication).

## Games

Currently available games:

- **Tic Tac Toe**: Classic game. Play against a friend.
- **Snake**: Guide the serpent, eat apples, and avoid collisions.
- **Pong**: _Coming Soon_
- **Tetris**: _Coming Soon_

## Features

- **Real-time Backend**: Powered by [Convex](https://convex.dev/), enabling real-time game updates and leaderboards.
- **Authentication**: Secure user management with [Clerk](https://clerk.com/).
- **Modern UI**: "Glassmorphism" design with neon accents, built using Tailwind CSS v4 and shadcn/ui.
- **Animations**: Smooth transitions and interactions using Framer Motion.
- **Accessible**: Designed with accessibility in mind (ARIA landmarks, keyboard navigation).

## Tech stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database / Backend**: [Convex](https://convex.dev/)
- **Auth**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Motion**: [Framer Motion](https://www.framer.com/motion/)

## Getting started

### Prerequisites

- Node.js
- npm or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd template-nextjs-clerk
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Setup environment variables:**
    Copy the example environment file and fill in your Clerk keys:

    ```bash
    cp .env.example .env.local
    ```

4.  **Setup Convex:**
    Initialize your Convex backend:

    ```bash
    npx convex dev
    ```

    This command will prompt you to log in and configure the project.

5.  **Configure authentication:**
    - In your **Convex Dashboard**, go to `Settings` > `Environment Variables`.
    - Add `CLERK_JWT_ISSUER_DOMAIN` with your Clerk Issuer URL (found in Clerk Dashboard > JWT Templates).
    - Ensure your `convex/auth.config.ts` is configured to use this variable.

6.  **Run the app:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to play!

## Contributing

Since this is a learning project, contributions are welcome if you'd like to suggest improvements or fix bugs!

## License

This project is open source.
