import { cn } from "@/lib/utils";

export const Divider = ({ className }: { className?: string }) => {
  return <div className={cn("h-px bg-border my-2", className)} />;
};
