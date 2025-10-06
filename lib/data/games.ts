import { GiTicTacToe } from "react-icons/gi";
import { VscSnake } from "react-icons/vsc";
import { MdOutlineLock } from "react-icons/md";
import { IconType } from "react-icons/lib";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Game = {
  href: string;
  title: string;
  description: string;
  menuDescription: string;
  difficulty: Difficulty;
  available: boolean;
  icon: IconType;
};

export const GAMES: Game[] = [
  {
    href: "/games/tic-tac-toe",
    title: "Tic Tac Toe",
    description:
      "Play against a friend or AI in this classic game of Xs and Os. Get three in a row to win!",
    menuDescription: "Get three in a row against a friend or AI.",
    difficulty: "Easy",
    available: true,
    icon: GiTicTacToe,
  },
  {
    href: "/games/snake",
    title: "Snake",
    description:
      "Guide the serpent and grab the glowing bites. Eat the apples to grow and avoid collisions.",
    menuDescription: "Guide the serpent and grab the glowing bites.",
    difficulty: "Medium",
    available: true,
    icon: VscSnake,
  },
  {
    href: "/games/pong",
    title: "Pong",
    description: "Coming soon.",
    menuDescription: "Coming soon.",
    difficulty: "Medium",
    available: false,
    icon: MdOutlineLock,
  },
  {
    href: "/games/tetris",
    title: "Tetris",
    description: "Coming soon.",
    menuDescription: "Coming soon.",
    difficulty: "Hard",
    available: false,
    icon: MdOutlineLock,
  },
];
