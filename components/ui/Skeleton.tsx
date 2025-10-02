type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "h-4 w-24" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      role="presentation"
      aria-hidden
    />
  );
}
