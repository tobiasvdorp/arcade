"use client";

import { ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Gamepad2, Puzzle, Rocket, Swords } from "lucide-react";
import clsx from "clsx";

type DockItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

const DOCK_ITEMS: DockItem[] = [
  { id: "snake", label: "Snake", icon: <Swords className="size-5" /> },
  { id: "tetris", label: "Tetris", icon: <Puzzle className="size-5" /> },
  { id: "memory", label: "Memory", icon: <Gamepad2 className="size-5" /> },
  { id: "pong", label: "Pong", icon: <Rocket className="size-5" /> },
];

export function NeoArcadeDock() {
  return (
    <div
      className={clsx(
        "fixed inset-x-0 bottom-3 z-50 flex justify-center",
        "[perspective:800px]",
      )}
      aria-label="Neo-Arcade Dock"
    >
      <div
        className={clsx(
          "glass shadow-layered rounded-2xl px-3 py-2",
          "border border-[var(--glass-border)]",
          "backdrop-saturate-150",
        )}
        role="navigation"
      >
        <Tabs.Root defaultValue="snake">
          <Tabs.List className="flex items-center gap-1">
            {DOCK_ITEMS.map((item) => (
              <Tabs.Trigger
                key={item.id}
                value={item.id}
                className={clsx(
                  "group data-[state=active]:bg-[hsl(var(--primary)/0.12)]",
                  "data-[state=active]:text-primary hover:bg-muted",
                  "rounded-xl px-3 py-2 outline-none",
                  "transition-transform duration-200 will-change-transform",
                  "hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]",
                )}
                aria-label={item.label}
              >
                <span
                  className={clsx(
                    "inline-flex items-center gap-2",
                    "[transform:rotateX(0.0001deg)] [transform-style:preserve-3d]",
                    "group-hover:[transform:translateZ(6px)]",
                  )}
                >
                  {item.icon}
                  <span className="sr-only md:not-sr-only md:inline text-sm">
                    {item.label}
                  </span>
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {DOCK_ITEMS.map((item) => (
            <Tabs.Content key={item.id} value={item.id} />
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
}
