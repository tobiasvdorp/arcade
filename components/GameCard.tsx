import Link from "next/link";

type GameCardProps = {
  href?: string;
  title: string;
  description?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  disabled?: boolean;
};

export function GameCard({
  href,
  title,
  description,
  difficulty,
  disabled,
}: GameCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-xs rounded-full px-2 py-1 bg-[hsl(var(--accent)/.18)]">
          {difficulty}
        </span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </>
  );

  const className =
    "group rounded-2xl border glass shadow-soft p-4 transition-[transform,box-shadow] duration-200 ease-out " +
    (disabled
      ? "opacity-70 cursor-not-allowed"
      : "hover:glow hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]");

  if (href && !disabled) {
    return (
      <Link href={href} className={className} aria-disabled={undefined}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} aria-disabled={disabled || undefined}>
      {content}
    </div>
  );
}
