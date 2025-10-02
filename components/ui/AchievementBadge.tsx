type AchievementBadgeProps = {
  label: string;
};

export function AchievementBadge({ label }: AchievementBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-[hsl(var(--accent)/.12)]">
      {label}
    </span>
  );
}
