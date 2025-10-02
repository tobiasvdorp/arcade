"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useGuestName } from "@/lib/stores/useGuestName";

export function GuestNameDialog() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { name, setName } = useGuestName();

  const [nameInput, setNameInput] = useState(name);

  // Show dialog on any /games/* route for guests without stored name
  useEffect(() => {
    if (isSignedIn) {
      setOpen(false);
      return;
    }
    const isGames = pathname?.startsWith("/games/") ?? false;
    setOpen(isGames && !name);
  }, [isSignedIn, pathname, name]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Play as guest</DialogTitle>
          <DialogDescription>
            Enter a name to continue. You can save your progress later by
            signing in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            autoFocus
            placeholder="Your name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameInput.trim()) {
                setName(nameInput);
                setOpen(false);
              }
            }}
          />
          <Button
            onClick={() => {
              if (!nameInput.trim()) return;
              setName(nameInput);
              setOpen(false);
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
