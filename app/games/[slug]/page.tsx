import { TicTacToe } from "@/components/Games/tic-tac-toe";

type GamePageProps = {
  params: { slug: string };
};

export default function GamePage({ params }: GamePageProps) {
  switch (params.slug) {
    case "tic-tac-toe":
      return <TicTacToe />;
    default:
      return <div className="container py-8">GamePage {params?.slug}</div>;
  }
}
