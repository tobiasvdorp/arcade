"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("arcade-reduced-motion");
    if (saved) setReduced(saved === "true");
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute(
      "data-user-reduced-motion",
      reduced,
    );
    localStorage.setItem("arcade-reduced-motion", String(reduced));
  }, [reduced]);

  return (
    <section className="container py-8" aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="text-3xl font-bold mb-6">
        Settings
      </h1>
      <div className="grid gap-4 max-w-xl">
        <div className="rounded-2xl border glass shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Theme</h2>
              <p className="text-sm text-muted-foreground">Light or Dark</p>
            </div>
            <select
              className="rounded-md border bg-background px-2 py-1"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        <div className="rounded-2xl border glass shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Reduced motion</h2>
              <p className="text-sm text-muted-foreground">
                Pause most animations
              </p>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />
              <span className="text-sm">Enabled</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
