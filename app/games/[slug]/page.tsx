import { PageProps } from "@/.next/types/app/games/[slug]/page";

export const GamePage = async ({ params }: PageProps) => {
  const awaitedParams = await params;

  return <div>GamePage {awaitedParams?.slug}</div>;
};

export default GamePage;
