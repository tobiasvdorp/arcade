import { Snake } from "@/components/Games/snake";
import { TicTacToe } from "@/components/Games/tic-tac-toe";
import { GameLayout } from "@/components/game/GameLayout";

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
      return (
        <GameLayout header={<h1 className="text-2xl font-bold">Snake</h1>}>
          <Snake />
        </GameLayout>
      );
    default:
      return <div className="container py-8">GamePage {params.slug}</div>;
  }
}
