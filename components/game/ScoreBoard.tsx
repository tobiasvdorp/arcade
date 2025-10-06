type ScoreBoardProps = {
  score: number;
  highScore?: number;
};

export function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-xl bg-primary/8 px-3 py-2 min-w-24">
        <span className="text-xs text-muted-foreground">Score</span>
        <div className="text-xl font-semibold">{score}</div>
      </div>
      <div className="rounded-xl bg-accent/8 px-3 py-2 min-w-24">
        <span className="text-xs text-muted-foreground">High</span>
        <div className="text-xl font-semibold">{highScore ?? 0}</div>
      </div>
    </div>
  );
}
