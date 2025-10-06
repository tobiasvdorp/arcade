import Link from "next/link";
import { PixelCanvas } from "./ui/pixel-canvas";
import { cn } from "@/lib/utils";

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
  const baseClasses = cn(
    "group rounded-2xl border glass shadow-soft p-4 transition-[transform,box-shadow] duration-200 ease-out h-40",
    {
      "opacity-70 cursor-not-allowed": disabled,
      "hover:glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring":
        !disabled,
    },
  );

  const content = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold group-hover:text-4xl group-hover:font-bold transition-all duration-200 ease-out">
          {title}
        </h3>
        <span className="text-xs rounded-full px-2 py-1 bg-accent/18 self-start">
          {difficulty}
        </span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <>
        <Link
          href={href}
          className={cn("inline-block overflow-hidden group", baseClasses)}
          style={
            { "--active-color": "hsl(var(--accent))" } as React.CSSProperties
          }
        >
          <PixelCanvas
            gap={10}
            speed={25}
            colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
            className="opacity-30"
          />
          {content}
        </Link>
      </>
    );
  }

  return (
    <div className={baseClasses} aria-disabled={disabled || undefined}>
      {content}
    </div>
  );
}
