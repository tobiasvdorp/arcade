import { ReactNode } from "react";

export function FocusRing({ children }: { children: ReactNode }) {
  return (
    <div className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]">
      {children}
    </div>
  );
}
