type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export const GamePage = async ({ params }: GamePageProps) => {
  const awaitedParams = await params;

  return <div>GamePage {awaitedParams?.slug}</div>;
};

export default GamePage;
