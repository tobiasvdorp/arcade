import { Snake } from "@/components/Games/snake";
import { TicTacToe } from "@/components/Games/tic-tac-toe";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GamePage({
  params: promiseParams,
}: GamePageProps) {
  const params = await promiseParams;

  switch (params.slug) {
    case "tic-tac-toe":
      return <TicTacToe />;
    case "snake":
      return <Snake />;
    default:
      return <div className="container py-8">GamePage {params.slug}</div>;
  }
}
